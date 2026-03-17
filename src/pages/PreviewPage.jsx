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
} from 'react-icons/fi';
import { getFileById, updateFileMetadata, deleteFile, updateFileLastOpened } from '../services/supabase';
import FileIcon from '../components/FileIcon';
import { getFileType, formatDate, getFileIconInfo, getCategoryStyles, getTagStyles } from '../utils/fileHelpers';
import { useFiles } from '../hooks/useFiles';
import { useTheme } from '../hooks/useTheme';

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
  const { toggleFavourite } = useFiles();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textContent, setTextContent] = useState('');

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

  useEffect(() => {
    fetchFile();
  }, [id]);

  const fetchFile = async () => {
    try {
      setLoading(true);
      const data = await getFileById(id);
      setFile(data);

      if (data) {
        setEditFormData({
          fileName: data.fileName || '',
          category: data.category || '',
          tags: (data.tags || []).join(', '),
          description: data.description || '',
        });

        // Update last opened silently in background
        updateFileLastOpened(id).catch(err => console.error('Failed to update last_opened:', err));
      }

      // If text file, fetch its content for preview
      if (data && getFileType(data.fileName) === 'text') {
        try {
          const res = await fetch(data.fileURL);
          const text = await res.text();
          setTextContent(text.slice(0, 50000)); // Limit preview size
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

      await updateFileMetadata(file.id, updatedMetadata);
      setIsEditing(false);
      // Update local state to reflect changes instantly without re-fetching
      setFile(prev => ({ ...prev, ...updatedMetadata }));
    } catch (err) {
      alert(err.message || 'Failed to update metadata.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFile(file.id);
      navigate('/'); // Go back to dashboard after deletion
    } catch (err) {
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
      navigate('/');
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
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { theme } = useTheme();
  const fileType = getFileType(file.fileName);
  const { color } = getFileIconInfo(file.fileName);
  const catStyles = getCategoryStyles(file.category, theme);

  // Direct Blob Download - Forces exact filename and correct OS formatting
  const handleDirectDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(file.fileURL);
      if (!response.ok) throw new Error('File fetch failed');

      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = localUrl;
      a.download = file.fileName; // The browser STRICTLY obeys this when using ObjectURLs

      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(localUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file directly. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };


  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return <img src={file.fileURL} alt={file.fileName} />;
      case 'pdf':
        return (
          <iframe
            src={file.fileURL}
            title={file.fileName}
            style={{ width: '100%', height: '70vh' }}
          />
        );
      case 'office':
        // Microsoft Office Online Embed Viewer (much more reliable for docx, xlsx, pptx)
        const msViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.fileURL)}`;

        return (
          <iframe
            src={msViewerUrl}
            title={file.fileName}
            style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px' }}
          />
        );
      case 'video':
        return (
          <video controls style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 'var(--radius)' }}>
            <source src={file.fileURL} />
            Your browser does not support video playback.
          </video>
        );
      case 'audio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <FileIcon fileName={file.fileName} size={64} />
            <audio controls>
              <source src={file.fileURL} />
              Your browser does not support audio playback.
            </audio>
          </div>
        );
      case 'text':
        return <pre>{textContent}</pre>;
      default:
        return (
          <div className="preview-fallback">
            <div className="preview-fallback-icon" style={{ color }}>
              <FileIcon fileName={file.fileName} size={64} />
            </div>
            <div className="preview-fallback-actions">
              <a
                href={file.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <FiExternalLink />
                Open / Preview
              </a>
              <button
                onClick={handleDirectDownload}
                className="btn btn-secondary"
                disabled={isDownloading}
              >
                <FiDownload />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button className="back-btn" onClick={handleBackNavigation} style={{ marginBottom: 0 }}>
          <FiArrowLeft />
          Back
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
        >
          <FiTrash2 />
          {isDeleting ? 'Deleting...' : 'Delete File'}
        </button>
      </div>

      <div className="preview-page">
        {/* Left panel — Preview */}
        <div className="preview-panel">
          <div className="preview-panel-header">
            <h2>Preview</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Favourite Action */}
              <button
                className="btn btn-secondary"
                onClick={async () => {
                  try {
                    await toggleFavourite(file.id, file.isFavourite);
                    setFile(prev => ({ ...prev, isFavourite: !prev.isFavourite }));
                  } catch (e) { /* Error naturally handled by global store */ }
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
                href={file.fileURL}
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
          <div className="preview-content">{renderPreview()}</div>
        </div>

        {/* Right panel — Metadata */}
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
      </div>
    </div>
  );
}
