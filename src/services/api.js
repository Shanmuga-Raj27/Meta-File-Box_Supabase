const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Common fetch wrapper to handle JWT tokens and base URL.
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Potential token expiration handling could go here
    // For now, we'll just let the caller handle it or logout
  }

  if (response.status === 204) {
    return null;
  }

  // Handle errors separately before trying to parse JSON
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    throw new Error(errorData.detail || errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const authService = {
  login: (email, password) => 
    apiFetch('/users/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData) =>
    apiFetch('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  getMe: () => apiFetch('/users/me/'),
};

export const fileService = {
  getFiles: () => apiFetch('/files/'),
  
  getFile: (id) => apiFetch(`/files/${id}/`),
  
  createFile: (fileData) => 
    apiFetch('/files/', {
      method: 'POST',
      body: JSON.stringify(fileData),
    }),
  
  updateFile: (id, fileData) =>
    apiFetch(`/files/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(fileData),
    }),
  
  deleteFile: (id) =>
    apiFetch(`/files/${id}/`, {
      method: 'DELETE',
    }),
  
  toggleFavourite: (id) =>
    apiFetch(`/files/${id}/toggle_favourite/`, {
      method: 'POST',
    }),
  
  markOpened: (id) =>
    apiFetch(`/files/${id}/mark_opened/`, {
      method: 'POST',
    }),
};
