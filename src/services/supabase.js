import { createClient } from '@supabase/supabase-js';

let supabase = null;
let initPromise = null;

/**
 * Initialize the Supabase client using environment variables.
 */
export async function initSupabase() {
  if (supabase) return supabase;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (url && anonKey && !url.startsWith('YOUR_')) {
      supabase = createClient(url, anonKey);
      return supabase;
    }

    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
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

  if (onProgress) onProgress(10);

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  if (onProgress) onProgress(80);

  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  if (onProgress) onProgress(100);
  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage bucket.
 * @param {string} filePath - The relative path inside the 'uploads' bucket.
 */
export async function deleteStorageFile(filePath) {
  if (!filePath) return;
  await initSupabase();

  const { error } = await supabase.storage
    .from('uploads')
    .remove([filePath]);

  if (error) {
    console.error(`Storage deletion failed for ${filePath}:`, error.message);
    throw new Error(`Failed to delete storage file: ${error.message}`);
  }
}
