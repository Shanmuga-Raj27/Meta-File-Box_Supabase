import { useState, useEffect } from 'react';
import { getFiles, updateFileFavourite } from '../services/supabase';

export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Race against a 8-second timeout so the UI doesn't hang forever
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out. Please check your Supabase configuration in public/supabase.json.')), 8000)
      );

      const data = await Promise.race([getFiles(), timeoutPromise]);
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const toggleFavourite = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setFiles(prev => 
      prev.map(f => f.id === id ? { ...f, isFavourite: newStatus } : f)
    );

    try {
      await updateFileFavourite(id, newStatus);
    } catch (err) {
      // Revert on failure
      setFiles(prev => 
        prev.map(f => f.id === id ? { ...f, isFavourite: currentStatus } : f)
      );
      console.error(err);
    }
  };

  return { files, loading, error, refetch: fetchFiles, toggleFavourite };
}
