import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiFile, FiCheck } from 'react-icons/fi';
import { uploadFile, saveFileMetadata } from '../services/supabase';

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

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);

  const handleFileSelect = (f) => {
    if (!f) return;
    setFile(f);
    if (!fileName) setFileName(f.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a file', 'error');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const fileURL = await uploadFile(file, (p) => setProgress(p));
      const ext = file.name.split('.').pop().toLowerCase();

      await saveFileMetadata({
        fileName: fileName || file.name,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        category: category || 'Other',
        description,
        fileURL,
        fileType: ext,
      });

      showToast('File uploaded successfully!');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1 className="page-title">Upload File</h1>
      <p className="page-subtitle">
        Add a new file with metadata to your library.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        {/* File drop zone */}
        <div className="form-group">
          <label>File</label>
          <div
            className={`file-drop-zone ${dragOver ? 'dragover' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {file ? <FiCheck style={{ color: 'var(--success)' }} /> : <FiUploadCloud />}
            <p>
              {file
                ? 'File selected — click to change'
                : 'Drag & drop a file here, or click to browse'}
            </p>
            {file && <div className="selected-file"><FiFile style={{ display: 'inline', marginRight: 6 }} />{file.name}</div>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
            id="file-input"
          />
        </div>

        {/* File name */}
        <div className="form-group">
          <label htmlFor="file-name-input">File Name</label>
          <input
            id="file-name-input"
            className="form-input"
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags-input">
            Tags <span>(separated by commas)</span>
          </label>
          <input
            id="tags-input"
            className="form-input"
            type="text"
            placeholder="e.g. report, finance, Q1"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category-input">Category</label>
          <input
            id="category-input"
            className="form-input"
            type="text"
            list="categories-list"
            placeholder="Select or type a custom category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="categories-list">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description-input">Description</label>
          <textarea
            id="description-input"
            className="form-textarea"
            placeholder="Describe this file…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-label">
              {progress < 100
                ? `Uploading… ${Math.round(progress)}%`
                : 'Saving metadata…'}
            </div>
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: 24 }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
            id="upload-submit-btn"
          >
            <FiUploadCloud />
            {uploading ? 'Uploading…' : 'Upload File'}
          </button>
        </div>
      </form>

      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
