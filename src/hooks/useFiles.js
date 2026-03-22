import { useState, useEffect } from 'react';
import { fileService } from '../services/api';
import { useAuth } from './useAuth';

export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  const fetchFiles = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fileService.getFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    } else {
      setLoading(false);
      setFiles([]);
    }
  }, [isAuthenticated]);

  const toggleFavourite = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setFiles(prev => 
      prev.map(f => f.id === id ? { ...f, isFavourite: newStatus } : f)
    );

    try {
      await fileService.toggleFavourite(id);
    } catch (err) {
      // Revert on failure
      setFiles(prev => 
        prev.map(f => f.id === id ? { ...f, isFavourite: currentStatus } : f)
      );
      console.error(err);
    }
  };

  const markOpened = async (id) => {
    try {
      await fileService.markOpened(id);
      fetchFiles(); // Refresh to get new lastOpened
    } catch (err) {
      console.error(err);
    }
  };

  return { files, loading, error, refetch: fetchFiles, toggleFavourite, markOpened };
}
