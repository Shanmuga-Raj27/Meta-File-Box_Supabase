import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  FiArrowLeft,
  FiExternalLink,
  FiDownload,
  FiCalendar,
  FiTag,
  FiFolder,
  FiFileText,
  FiFile as FiFileGeneric,
  FiEdit2,
  FiSave,
  FiX,
  FiTrash2,
  FiHeart,
  FiRefreshCw,
  FiMaximize,
  FiMinimize,
} from 'react-icons/fi';
import { fileService } from '../services/api';
import { deleteStorageFile } from '../services/supabase';
import FileIcon from '../components/FileIcon';
import { getFileType, formatDate, getFileIconInfo, getCategoryStyles, getTagStyles } from '../utils/fileHelpers';
import FilePreview from '../components/FilePreview';
import { useFiles } from '../hooks/useFiles';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const CATEGORIES = [
  'Documents',
  'Images',
  'Videos',
  'Audio',
  'Presentations',
  'Spreadsheets',
  'Archives',
  'Code',
  'Other',
];
export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { files, toggleFavourite } = useFiles();
  const { isAuthenticated, executeProtectedAction } = useAuth();
  const { theme } = useTheme();

  const [retryCount, setRetryCount] = useState(0);
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Edit & Delete State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [editFormData, setEditFormData] = useState({
    fileName: '',
    category: '',
    tags: '',
    description: '',
  });

  // Numeric ID comparison fix for STATE-FIRST load
  const existingFile = files.find(f => String(f.id) === String(id));
  const [file, setFile] = useState(existingFile || null);
  const [loading, setLoading] = useState(!existingFile);
  const [textContent, setTextContent] = useState('');

  // ALL HOOKS ABOVE THIS POINT.
  if (!isAuthenticated && !loading) {
    return (
      <div style={{ padding: '20px' }}>
        <button className="back-btn" onClick={() => navigate('/dashboard')} style={{ marginBottom: 24 }}>
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="empty-dashboard">
          <div className="empty-dashboard-icon">
            <FiFileGeneric />
          </div>
          <h2>Authentication Required</h2>
          <p>Please login or create an account to view and manage file metadata.</p>
          <button
            className="btn btn-primary"
            onClick={() => executeProtectedAction(() => { })}
          >
            Sign In to View File
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchFile();
  }, [id, retryCount]);


  const fetchFile = async () => {
    try {
      // Only show global spinner if we have NO data at all
      if (!file) setLoading(true);

      const data = await fileService.getFile(id);
      setFile(data);

      if (data) {
        setEditFormData({
          fileName: data.fileName || '',
          category: data.category || '',
          tags: (data.tags || []).join(', '),
          description: data.description || '',
        });

        // Update last opened silently in background
        fileService.markOpened(id).catch(err => console.error('Failed to update lastOpened:', err));
      }

      // If text file, fetch its content
      if (data && getFileType(data.fileName) === 'text') {
        try {
          const res = await fetch(data.fileURL);
          const text = await res.text();
          setTextContent(text.slice(0, 50000));
        } catch {
          setTextContent('Unable to load text content.');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetadata = async () => {
    try {
      setIsSaving(true);
      const updatedMetadata = {
        fileName: editFormData.fileName.trim() || file.fileName,
        category: editFormData.category,
        tags: editFormData.tags.split(',').map(t => t.trim()).filter(Boolean),
        description: editFormData.description,
      };

      await fileService.updateFile(file.id, updatedMetadata);
      setIsEditing(false);
      setFile(prev => ({ ...prev, ...updatedMetadata }));
    } catch (err) {
      alert(err.message || 'Failed to update metadata.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this file permanently?')) return;
      
      setIsDeleting(true);

      // Attempt Storage Deletion FIRST 
      try {
        if (file && file.fileURL) {
          // Extract path: .../public/uploads/17424..._file.png -> 17424..._file.png
          const urlParts = file.fileURL.split('/uploads/');
          if (urlParts.length > 1) {
             const storagePath = decodeURIComponent(urlParts[1]);
             await deleteStorageFile(storagePath);
          }
        }
      } catch (storageErr) {
        console.error('Storage deletion failed:', storageErr);
      }

      // Backend Record Deletion
      try {
        await fileService.deleteFile(file.id);
      } catch (backendErr) {
        const errorMsg = backendErr.message || '';
        if (errorMsg.toLowerCase().includes('not found') || backendErr.status === 404) {
           console.log('Record already gone from database.');
        } else {
           throw backendErr;
        }
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete file.');
      setIsDeleting(false);
    }
  };

  const handleBackNavigation = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from.pathname + location.state.from.search);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="empty-state">
        <FiFileGeneric />
        <h3>File not found</h3>
        <p>The file you're looking for doesn't exist or was removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const fileType = getFileType(file.fileName);
  const { color } = getFileIconInfo(file.fileName);
  const catStyles = getCategoryStyles(file.category, theme);

  const handleDirectDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(file.fileURL);
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = localUrl;
      a.download = file.fileName;
      a.click();
      window.URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getExternalUrl = () => {
    const type = getFileType(file.fileName);
    if (type === 'office' || type === 'pdf') {
       return `https://docs.google.com/gview?url=${encodeURIComponent(file.fileURL)}&embedded=false`;
    }
    return file.fileURL;
  };

  const renderPreview = () => {
    if (!file) return null;
    return (
      <FilePreview 
        file={{...file, textContent}} 
        onRetry={() => setRetryCount(c => c + 1)} 
      />
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button className="back-btn" onClick={handleBackNavigation} style={{ marginBottom: 0 }}>
          <FiArrowLeft /> Back
        </button>
        <button className="btn btn-secondary" onClick={handleDelete} disabled={isDeleting} style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
          <FiTrash2 /> {isDeleting ? 'Deleting...' : 'Delete File'}
        </button>
      </div>

      <div className={`preview-page ${isCinemaMode ? 'cinema-mode' : ''}`}>
        {/* Left panel — Preview */}
        <div className="preview-panel">
          <div className="preview-panel-header">
            <h2>Preview</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Cinema Mode Toggle */}
              <button
                className="btn btn-secondary"
                onClick={() => setIsCinemaMode(!isCinemaMode)}
                style={{ padding: '6px 12px', fontSize: 13 }}
                title={isCinemaMode ? "Exit Cinema Mode" : "Cinema Mode (Wide)"}
              >
                {isCinemaMode ? <FiMinimize /> : <FiMaximize />}
              </button>

              <button
                className="btn btn-secondary"
                onClick={async () => {
                  try {
                    await toggleFavourite(file.id, file.isFavourite);
                    setFile(prev => ({ ...prev, isFavourite: !prev.isFavourite }));
                  } catch (e) { }
                }}
                style={{
                  padding: '6px 12px',
                  fontSize: 13,
                  color: file.isFavourite ? 'var(--error)' : 'var(--text-muted)',
                  borderColor: file.isFavourite ? 'var(--error)' : 'var(--border)'
                }}
                title={file.isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              >
                <FiHeart style={{ fill: file.isFavourite ? 'currentColor' : 'none' }} />
              </button>

              <a
                href={getExternalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: 13 }}
                title="Open in new tab"
              >
                <FiExternalLink />
              </a>
              <button
                onClick={handleDirectDownload}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: 13 }}
                title="Direct Download"
                disabled={isDownloading}
              >
                <FiDownload />
              </button>
            </div>
          </div>
          <div className={`preview-content ${fileType === 'pdf' || fileType === 'office' ? 'full-bleed' : ''}`}>{renderPreview()}</div>
        </div>

        {/* Right panel — Metadata (Hidden in Cinema Mode) */}
        {!isCinemaMode && (
          <div className="metadata-panel">
            <div className="metadata-panel-header">
              <h2>File Information</h2>
              {!isEditing ? (
                <button className="btn btn-secondary" onClick={() => setIsEditing(true)} style={{ padding: '6px 12px', fontSize: 13 }}>
                  <FiEdit2 /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '6px 12px', fontSize: 13 }} disabled={isSaving}>
                    <FiX /> Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveMetadata} style={{ padding: '6px 12px', fontSize: 13 }} disabled={isSaving}>
                    <FiSave /> {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            <div className="metadata-body">
              <div className="metadata-item">
                <span className="metadata-label">
                  <FiFileGeneric style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  File Name
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.fileName}
                    onChange={(e) => setEditFormData({ ...editFormData, fileName: e.target.value })}
                    style={{ marginTop: 4 }}
                  />
                ) : (
                  <span className="metadata-value">{file.fileName}</span>
                )}
              </div>

              <div className="metadata-item">
                <span className="metadata-label">
                  <FiFileText style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  File Type
                </span>
                <span className="metadata-value" style={{ textTransform: 'uppercase' }}>
                  {file.fileType || '—'}
                </span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">
                  <FiFolder style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Category
                </span>
                {isEditing ? (
                  <>
                    <input
                      className="form-input"
                      type="text"
                      list="categories-list-edit"
                      placeholder="Select or type a custom category"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      style={{ marginTop: 4 }}
                    />
                    <datalist id="categories-list-edit">
                      {CATEGORIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </>
                ) : (
                  <span className="metadata-value">
                    {file.category ? (
                      <span className="file-card-category" style={{ color: catStyles.text, background: catStyles.bg }}>{file.category}</span>
                    ) : (
                      '—'
                    )}
                  </span>
                )}
              </div>

              <div className="metadata-item">
                <span className="metadata-label">
                  <FiTag style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Tags
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.tags}
                    placeholder="e.g. report, design"
                    onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                    style={{ marginTop: 4 }}
                  />
                ) : (
                  <div className="metadata-tags">
                    {(file.tags || []).length > 0
                      ? file.tags.map((tag, i) => {
                        const tagStyles = getTagStyles(tag, theme);
                        return (
                          <span className="tag-chip" key={i} style={{ color: tagStyles.text, background: tagStyles.bg }}>
                            <FiTag size={12} /> {tag}
                          </span>
                        );
                      })
                      : <span className="metadata-value">—</span>}
                  </div>
                )}
              </div>

              <div className="metadata-item">
                <span className="metadata-label">
                  <FiCalendar style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Upload Date
                </span>
                <span className="metadata-value">{formatDate(file.uploadDate)}</span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Description</span>
                {isEditing ? (
                  <textarea
                    className="form-textarea"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    style={{ marginTop: 4 }}
                  />
                ) : (
                  <span className="metadata-value">
                    {file.description || 'No description provided.'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
