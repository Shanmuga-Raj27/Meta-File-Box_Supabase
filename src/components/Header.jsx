import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

export default function Header({ searchQuery, onSearchChange }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-spacer" style={{ flex: 1 }}></div>

      <div className="header-actions">
        <button
          className={`theme-toggle ${theme === 'dark' ? 'dark' : ''}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle-btn"
        >
          <span className="theme-toggle-icons">
            <FiSun />
            <FiMoon />
          </span>
        </button>
      </div>
    </header>
  );
}
