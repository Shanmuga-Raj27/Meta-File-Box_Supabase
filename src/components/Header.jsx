import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export default function Header({ searchQuery, onSearchChange }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, openAuthModal, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="user-avatar" style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
        }}>
          <FiUser />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
          {isAuthenticated ? (user?.firstName || user?.email) : 'Guest'}
        </span>
      </div>

      <div className="header-spacer" style={{ flex: 1 }}></div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className={`theme-toggle ${theme === 'dark' ? 'dark' : ''}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle-btn"
          style={{ marginRight: 8 }}
        >
          <span className="theme-toggle-icons">
            <FiSun />
            <FiMoon />
          </span>
        </button>

        {!isAuthenticated ? (
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => openAuthModal('login')}
              style={{ padding: '6px 16px', fontSize: '13px' }}
            >
              Login
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => openAuthModal('register')}
              style={{ padding: '6px 16px', fontSize: '13px' }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={logout}
            style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--error)' }}
          >
            <FiLogOut /> Logout
          </button>
        )}
      </div>
    </header>
  );
}
