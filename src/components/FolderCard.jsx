import { FiFolder } from 'react-icons/fi';
import { useState } from 'react';

export default function FolderCard({ title, count, onClick, color }) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine colors based on type (Favourite vs Regular)
  const isFavourite = color === 'var(--error)' || color === '#ef4444' || color === '#ef4444'; 
  
  const bg = isFavourite ? '#fee2e2' : '#1A4A96'; // Light red or Deep blue
  const textColor = isFavourite ? '#991b1b' : '#ffffff'; // Dark red or White
  const borderColor = isHovered 
    ? (isFavourite ? '#ef4444' : '#4D301B')  // Bright red or Deep brown
    : (isFavourite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)');
  const iconBg = isFavourite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.15)';
  const iconColor = isFavourite ? '#ef4444' : '#ffffff';

  return (
    <div
      className="folder-card"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: bg,
        borderRadius: 'var(--radius)',
        padding: '24px',
        border: `2px solid ${borderColor}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        color: textColor,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isHovered ? 10 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            background: iconBg,
            color: iconColor,
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)'
          }}
        >
          <FiFolder size={32} style={{ fill: isFavourite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.3)' }} />
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          color: textColor, 
          letterSpacing: '-0.3px',
          textShadow: (!isFavourite && isHovered) ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
        }}>
          {title}
        </h3>
        <span style={{ fontSize: '0.9rem', color: isFavourite ? 'rgba(153, 27, 27, 0.7)' : 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
          {count} {count === 1 ? 'file' : 'files'}
        </span>
      </div>
    </div>
  );
}
