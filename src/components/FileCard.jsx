import { Link, useLocation } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import FileIcon from './FileIcon';
import { getFileIconInfo, getCategoryStyles, getTagStyles } from '../utils/fileHelpers';
import { useTheme } from '../hooks/useTheme';

export default function FileCard({ file }) {
  const location = useLocation();
  const { theme } = useTheme();
  const { color } = getFileIconInfo(file.fileName);
  const catStyles = getCategoryStyles(file.category, theme);
  const ext = (file.fileName || '').split('.').pop().toUpperCase();

  return (
    <Link to={`/dashboard/preview/${file.id}`} state={{ from: location }} className="file-card" id={`file-card-${file.id}`}>
      <div className="file-card-header">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
          <div
            className="file-card-icon"
            style={{ background: `${color}18`, color }}
          >
            <FileIcon fileName={file.fileName} size={24} />
          </div>
          <div className="file-card-info" style={{ flex: 1, minWidth: 0 }}>
            <div className="file-card-name" title={file.fileName}>
              {file.fileName}
            </div>
            <div className="file-card-type">{ext} file</div>
          </div>
        </div>
      </div>
      <div className="file-card-footer">
        {file.category && (
          <span className="file-card-category" style={{ color: catStyles.text, background: catStyles.bg }}>
            {file.category}
          </span>
        )}
        {(file.tags || []).slice(0, 3).map((tag, i) => {
          const tagStyles = getTagStyles(tag, theme);
          return (
            <span className="tag-chip" key={i} style={{ color: tagStyles.text, background: tagStyles.bg }}>
              <FiTag size={12} /> {tag}
            </span>
          );
        })}
        {(file.tags || []).length > 3 && (
          <span className="tag-chip">+{file.tags.length - 3}</span>
        )}
      </div>
    </Link>
  );
}
