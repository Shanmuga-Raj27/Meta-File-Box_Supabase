import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiUploadCloud, FiFolder, FiMenu, FiX, FiClock, FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/recent', action: '?filter=recent', label: 'Recently Opened', icon: <FiClock /> },
  { to: '/favourites', action: '?filter=favourites', label: 'Favourites', icon: <FiHeart /> },
  { to: '/upload', label: 'Upload File', icon: <FiUploadCloud /> },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: 18,
          left: 16,
          zIndex: 200,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 8px',
          fontSize: 20,
          color: 'var(--text)',
        }}
        id="mobile-menu-toggle"
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <FiFolder />
          </div>
          <h1>Meta File Box</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            // Using a button/custom Link approach for Dashboard filters
            const isFilterLink = !!item.action;
            
            const handleClick = (e) => {
              setMobileOpen(false);
              if (isFilterLink) {
                e.preventDefault();
                navigate(item.action); // Navigates to /?filter=...
              }
            };

            const isActive = isFilterLink 
              ? location.search === item.action
              : location.pathname === item.to && !location.search;

            return (
              <NavLink
                key={item.label}
                to={isFilterLink ? item.action : item.to}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={handleClick}
                title={isCollapsed ? item.label : undefined}
                style={{
                  justifyContent: isCollapsed ? 'center' : 'flex-start'
                }}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapser Toggle */}
        <button 
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            margin: '0 auto 16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background var(--transition)',
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>

        <div className="sidebar-footer">
          © 2026 Meta File Box
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99,
          }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
