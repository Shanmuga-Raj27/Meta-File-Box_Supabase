import { createClient } from '@supabase/supabase-js';

let supabase = null;
let initPromise = null;

/**
 * Initialize the Supabase client using environment variables.
 * We use import.meta.env which is the standard way in Vite.
 */
export async function initSupabase() {
  if (supabase) return supabase;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // Check environment variables first (for Vercel/Production)
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (url && anonKey && !url.startsWith('YOUR_')) {
      supabase = createClient(url, anonKey);
      return supabase;
    }

    // Fallback to supabase.json for local legacy support if needed
    try {
      const res = await fetch('/supabase.json');
      if (res.ok) {
        const config = await res.json();
        if (config.url && config.anonKey && !config.url.startsWith('YOUR_')) {
          supabase = createClient(config.url, config.anonKey);
          return supabase;
        }
      }
    } catch (e) {
      // Ignore fallback error
    }

    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables or .env file.'
    );
  })();

  return initPromise;
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadFile(file, onProgress) {
  await initSupabase();

  const filePath = `${Date.now()}_${file.name}`;

  // Supabase JS v2 doesn't support progress natively for small uploads,
  // so we simulate progress: 0 → 50 at start, 100 on completion.
  if (onProgress) onProgress(10);

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type, // Explicitly pass the MIME type
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  if (onProgress) onProgress(80);

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  if (onProgress) onProgress(100);
  return urlData.publicUrl;
}

/**
 * Save file metadata to the Supabase 'files' table.
 * The table is auto-created via the first insert if using the API,
 * but it's better to create it via the Supabase dashboard.
 */
export async function saveFileMetadata(metadata) {
  await initSupabase();

  const { data, error } = await supabase
    .from('files')
    .insert({
      file_name: metadata.fileName,
      tags: metadata.tags || [],
      category: metadata.category || 'Other',
      description: metadata.description || '',
      file_url: metadata.fileURL,
      file_type: metadata.fileType || '',
      upload_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save metadata: ${error.message}`);
  return data.id;
}

/**
 * Get all files, ordered by upload date (newest first).
 */
export async function getFiles() {
  await initSupabase();

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .order('upload_date', { ascending: false });

  if (error) throw new Error(`Failed to load files: ${error.message}`);

  // Map column names back to the camelCase format the UI expects
  return (data || []).map((row) => ({
    id: row.id,
    fileName: row.file_name,
    tags: row.tags || [],
    category: row.category,
    description: row.description,
    fileURL: row.file_url,
    fileType: row.file_type,
    uploadDate: row.upload_date,
    isFavourite: row.is_favourite || false,
    lastOpened: row.last_opened,
  }));
}

/**
 * Get a single file by its ID.
 */
export async function getFileById(id) {
  await initSupabase();

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  return {
    id: data.id,
    fileName: data.file_name,
    tags: data.tags || [],
    category: data.category,
    description: data.description,
    fileURL: data.file_url,
    fileType: data.file_type,
    uploadDate: data.upload_date,
    isFavourite: data.is_favourite || false,
    lastOpened: data.last_opened,
  };
}

/**
 * Update file metadata in the Supabase 'files' table.
 */
export async function updateFileMetadata(id, metadata) {
  await initSupabase();

  const { error } = await supabase
    .from('files')
    .update({
      file_name: metadata.fileName,
      tags: metadata.tags || [],
      category: metadata.category || 'Other',
      description: metadata.description || '',
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update metadata: ${error.message}`);
}

/**
 * Toggle the favourite status of a file.
 */
export async function updateFileFavourite(id, isFavourite) {
  await initSupabase();

  const { error } = await supabase
    .from('files')
    .update({ is_favourite: isFavourite })
    .eq('id', id);

  if (error) throw new Error(`Failed to update favourite status: ${error.message}`);
}

/**
 * Update the last_opened timestamp for a file to NOW().
 */
export async function updateFileLastOpened(id) {
  await initSupabase();

  const { error } = await supabase
    .from('files')
    .update({ last_opened: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Failed to update last opened time: ${error.message}`);
}

/**
 * Delete a file record by ID, and remove the actual file from Storage.
 */
export async function deleteFile(id) {
  await initSupabase();

  // 1. Get the file to extract the storage URL
  const file = await getFileById(id);
  if (!file) throw new Error('File not found in database.');

  // 2. Delete the actual file from the bucket FIRST
  // This guarantees we don't end up with orphaned physical files if the DB delete works but Storage is blocked
  if (file.fileURL) {
    try {
      // Safely parse the exact path using the URL constructor
      const urlObj = new URL(file.fileURL);
      const parts = urlObj.pathname.split('/public/uploads/');
      
      let storagePath = null;
      if (parts.length > 1) {
        // Decode URI component because spaces in names become %20 in URLs
        storagePath = decodeURIComponent(parts[1]); 
      } else {
        // Fallback for custom domains/formats
        const match = file.fileURL.match(/\/uploads\/(.+)$/);
        if (match && match[1]) {
          storagePath = decodeURIComponent(match[1].split('?')[0]);
        }
      }

      if (storagePath) {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('uploads')
          .remove([storagePath]);
          
        if (storageError) {
          throw new Error(`Failed to delete file from storage: ${storageError.message}`);
        }
        
        // Supabase returns an empty array if the file was already deleted manually OR if RLS blocked it.
        // We log a warning instead of throwing so the user can clean up the ghost database record.
        if (!storageData || storageData.length === 0) {
          console.warn('Storage delete returned empty. File was already deleted manually, or RLS blocked the action.');
        }
      } else {
        throw new Error('Could not parse the storage path from the file URL.');
      }
    } catch (err) {
      throw new Error(`Storage deletion failed: ${err.message}`);
    }
  }

  // 3. Delete the metadata record from the database only after storage succeeds
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', id);

  if (dbError) {
     throw new Error(`Failed to delete file record from database: ${dbError.message}`);
  }
}

