import React, { useState, useEffect } from 'react';
import { 
  FiFile, 
  FiX, 
  FiRefreshCw, 
  FiDownload, 
  FiExternalLink,
  FiEyeOff
} from 'react-icons/fi';
import { getFileType } from '../utils/fileHelpers';

/**
 * Reusable FilePreview Component
 * Handles multiple formats, loading states, and robust error fallbacks.
 */
const FilePreview = ({ file, height = '85vh', onRetry }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState('primary'); // 'primary', 'fallback', 'external'
  const [retryCount, setRetryCount] = useState(0);

  const fileType = getFileType(file.fileName);
  const fileUrl = file.fileURL;

  // Reset state when file changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setMode('primary');
  }, [file.id, retryCount]);

  if (!fileUrl) {
    return (
      <div className="preview-error-container">
        <FiEyeOff size={48} color="var(--error)" />
        <h3>Preview Unavailable</h3>
        <p>This file does not have a valid URL for previewing.</p>
      </div>
    );
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) onRetry();
  };

  const renderLoading = () => (
    <div className="preview-skeleton-container" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'var(--bg-card)', padding: '24px' }}>
      <div className="skeleton-loader" style={{ height: '32px', width: '40%', marginBottom: '24px' }} />
      <div className="skeleton-loader" style={{ flex: 1, minHeight: '300px' }} />
      <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)' }}>
        Preparing your {fileType} preview...
      </p>
    </div>
  );

  const renderError = (message) => (
    <div className="preview-error-overlay">
      <FiX size={48} color="var(--error)" />
      <h3>Failed to load preview</h3>
      <p>{message || "The file viewer encountered an unexpected error."}</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button className="btn btn-primary" onClick={handleRetry}>
          <FiRefreshCw /> Retry
        </button>
        <a href={fileUrl} download={file.fileName} className="btn btn-secondary">
          <FiDownload /> Download Instead
        </a>
      </div>
    </div>
  );

  const renderDocument = () => {
    const encodedUrl = encodeURIComponent(fileUrl);
    const viewers = {
      microsoft: `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`,
      google: `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`
    };

    // Primary choice: Microsoft for Office, Google for PDF (or Native)
    const primaryViewer = fileType === 'pdf' ? (mode === 'primary' ? fileUrl : viewers.google) : (mode === 'primary' ? viewers.microsoft : viewers.google);

    return (
      <div className="preview-iframe-wrapper" style={{ height, width: '100%', position: 'relative' }}>
        {loading && renderLoading()}
        {error && renderError("External viewer timed out or blocked this file.")}
        
        {/* Toggle Viewer Button */}
        <div className="preview-mode-toggle">
           <button 
             onClick={() => setMode(mode === 'primary' ? 'fallback' : 'primary')}
             className="btn-viewer-toggle"
           >
             <FiRefreshCw /> Try Alternate Viewer
           </button>
        </div>

        <iframe
          key={`${file.id}-${mode}-${retryCount}`}
          src={fileType === 'pdf' && mode === 'primary' ? `${fileUrl}#view=FitH,Top` : primaryViewer}
          title={file.fileName}
          className="preview-iframe"
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="preview-media-container" style={{ height }}>
            {loading && renderLoading()}
            <img 
              src={fileUrl} 
              alt={file.fileName} 
              onLoad={() => setLoading(false)}
              onError={() => setError(true)}
              style={{ opacity: loading ? 0 : 1 }}
            />
            {error && renderError("Image failed to load.")}
          </div>
        );

      case 'video':
        return (
          <div className="preview-media-container" style={{ height }}>
            <video 
              controls 
              src={fileUrl} 
              onCanPlay={() => setLoading(false)}
              onError={() => setError(true)}
              style={{ maxHeight: height }}
            >
              Your browser does not support video playback.
            </video>
            {error && renderError("Video failed to play.")}
          </div>
        );

      case 'audio':
        return (
          <div className="preview-audio-container">
             <FiFile size={64} color="var(--accent)" />
             <audio controls src={fileUrl}>
               Your browser does not support audio playback.
             </audio>
          </div>
        );

      case 'pdf':
      case 'office':
        return renderDocument();

      case 'text':
        return (
          <div className="preview-text-container" style={{ height }}>
             <pre className="text-content-box">{file.textContent || "Loading content..."}</pre>
          </div>
        );

      default:
        return (
          <div className="preview-fallback-container">
            <FiFile size={80} color="var(--text-muted)" />
            <h3>No Preview for this Format</h3>
            <p>We don't support in-browser preview for {file.fileName.split('.').pop().toUpperCase()} files yet.</p>
            <a href={fileUrl} download={file.fileName} className="btn btn-primary" style={{ marginTop: 20 }}>
              <FiDownload /> Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className={`file-preview-root ${fileType === 'pdf' || fileType === 'office' ? 'full-bleed' : ''}`}>
      {renderContent()}
    </div>
  );
};

export default FilePreview;
