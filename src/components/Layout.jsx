import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ searchQuery, onSearchChange }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main-wrapper">
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
