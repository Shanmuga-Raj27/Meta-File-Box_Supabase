import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ searchQuery, onSearchChange }) {
  const location = useLocation();
  const isPreview = location.pathname.includes('/preview/');

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main-wrapper">
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <main className={`app-content ${isPreview ? 'preview-mode' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
