import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiInbox, FiArrowLeft, FiClock, FiStar, FiFolder, FiTag, FiHeart } from 'react-icons/fi';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import SearchRibbon from '../components/SearchRibbon';
import { useFiles } from '../hooks/useFiles';
import { getCategoryStyles } from '../utils/fileHelpers';
import { useTheme } from '../hooks/useTheme';

import { useAuth } from '../hooks/useAuth';

const UI_TYPE_MAP = {
  'PDF': ['pdf'],
  'Images': ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'],
  'Documents': ['doc', 'docx', 'odt', 'rtf', 'txt', 'md'],
  'Videos': ['mp4', 'avi', 'mkv', 'mov', 'webm'],
  'Audio': ['mp3', 'wav', 'ogg', 'flac'],
  'Presentations': ['ppt', 'pptx'],
  'Spreadsheets': ['xls', 'xlsx', 'csv'],
  'Archives': ['zip', 'rar', '7z', 'tar', 'gz'],
  'Code': ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'html', 'css', 'json', 'xml']
};

export default function DashboardPage() {
  const { theme } = useTheme();
  const { isAuthenticated, executeProtectedAction } = useAuth();
  const { files, loading, error, toggleFavourite } = useFiles();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const urlFilter = searchParams.get('filter'); // 'favourites' | 'recent' | null
  const activeDrillDownCategory = searchParams.get('categoryFolder');
  const activeDrillDownFav = searchParams.get('favFolder');

  // Search & Filter state
  const [filters, setFilters] = useState({
    query: '',
    type: 'All',
    category: 'All',
    showFavourites: false
  });

  // Extract unique custom categories for the Ribbon
  const uniqueCategories = useMemo(() => {
    const set = new Set();
    files.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set).sort();
  }, [files]);

  // Apply filters linearly
  const filtered = useMemo(() => {
    let result = files;

    if (filters.showFavourites) {
      result = result.filter(f => f.isFavourite);
    }

    if (filters.category !== 'All') {
      result = result.filter(f => f.category === filters.category);
    }

    if (filters.type !== 'All') {
      result = result.filter(f => {
        const ext = (f.fileName || '').split('.').pop().toLowerCase();
        if (filters.type === 'Other') {
          // It's 'Other' if it doesn't match ANY known extension list
          return !Object.values(UI_TYPE_MAP).flat().includes(ext);
        }
        const validExts = UI_TYPE_MAP[filters.type] || [];
        return validExts.includes(ext);
      });
    }

    const query = filters.query.trim().toLowerCase();
    if (query) {
      result = result.filter(f => {
        const nameMatch = (f.fileName || '').toLowerCase().includes(query);
        const catMatch = (f.category || '').toLowerCase().includes(query);
        const tagsMatch = (f.tags || []).some((t) => t.toLowerCase().includes(query));
        return nameMatch || catMatch || tagsMatch;
      });
    }

    return result;
  }, [files, filters]);

  // Derived sections based on filtered files
  const recentlyOpened = useMemo(() => {
    return [...filtered]
      .filter(f => !!f.lastOpened)
      .sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened));
  }, [filtered]);

  const favouriteFoldersByType = useMemo(() => {
    const favs = filtered.filter(f => f.isFavourite);
    const groups = {};

    favs.forEach(f => {
      const ext = (f.fileName || '').split('.').pop().toLowerCase();
      let uiType = 'Other';
      for (const [key, exts] of Object.entries(UI_TYPE_MAP)) {
        if (exts.includes(ext)) {
          uiType = key;
          break;
        }
      }
      if (!groups[uiType]) groups[uiType] = [];
      groups[uiType].push(f);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const categoryFolders = useMemo(() => {
    const groups = {};
    filtered.forEach(f => {
      const cat = f.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const activeFolder = useMemo(() => {
    if (activeDrillDownCategory) {
      const match = categoryFolders.find(g => g[0] === activeDrillDownCategory);
      if (match) return { title: match[0], files: match[1] };
      return { title: activeDrillDownCategory, files: [] };
    }
    if (activeDrillDownFav) {
      const match = favouriteFoldersByType.find(g => g[0] === activeDrillDownFav);
      if (match) return { title: `Favourites: ${match[0]}`, files: match[1] };
      return { title: `Favourites: ${activeDrillDownFav}`, files: [] };
    }
    return null;
  }, [activeDrillDownCategory, activeDrillDownFav, categoryFolders, favouriteFoldersByType]);

  const handleCloseFolder = () => {
    if (activeDrillDownFav) navigate('?filter=favourites');
    else navigate('/dashboard');
  };

  // Determines if we are actively searching (so we just show a flat list)
  const isActivelyFiltering = filters.query.trim() !== '' || filters.type !== 'All' || filters.category !== 'All';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  // View: Folder Drill-Down Mode
  if (activeFolder) {
    return (
      <div className="drill-down-view">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button className="back-btn" onClick={handleCloseFolder} style={{ margin: 0 }}>
            <FiArrowLeft /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiFolder size={24} color="var(--primary)" />
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{activeFolder.title}</h1>
          </div>
          <span style={{ marginLeft: 'auto', background: 'var(--surface)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {activeFolder.files.length} {activeFolder.files.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="file-grid">
          {activeFolder.files.map((file) => (
            <FileCard key={file.id} file={file} onToggleFavourite={toggleFavourite} />
          ))}
        </div>
      </div>
    );
  }

  // View: Guest (Unauthenticated)
  if (!isAuthenticated && !loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Welcome to Meta File Box</h1>
            <p className="page-subtitle">The ultimate space for your secure files and metadata.</p>
          </div>
        </div>
        <div className="empty-dashboard">
          <div className="empty-dashboard-icon">
            <FiUploadCloud />
          </div>
          <h2>Access Your Personal Vault</h2>
          <p>Login or create an account to start uploading, organizing, and managing your files with rich metadata.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => executeProtectedAction(() => {})}
          >
            Get Started for Free
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <FiInbox />
        <h3>Could not load files</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manage, search, and organize your files.</p>
        </div>
        {!isActivelyFiltering && filtered.length > 0 && (
          <button 
            className="btn btn-primary" 
            style={{ padding: '10px 20px' }}
            onClick={() => executeProtectedAction(() => navigate('/dashboard/upload'))}
          >
            <FiUploadCloud /> Upload New File
          </button>
        )}
      </div>

      <SearchRibbon filters={filters} setFilters={setFilters} categories={uniqueCategories} />

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <FiInbox />
          <h3>{isActivelyFiltering || filters.showFavourites ? 'No files match your search' : 'No files yet'}</h3>
          <p>
            {isActivelyFiltering || filters.showFavourites
              ? 'Try adjusting your filters or search term.'
              : 'Upload your first file to get started.'}
          </p>
          {(!isActivelyFiltering && !filters.showFavourites) && (
            <Link to="/dashboard/upload" className="btn btn-primary">
              <FiUploadCloud />
              Upload File
            </Link>
          )}
        </div>
      ) : isActivelyFiltering ? (
        // Flat list for active search
        <div className="file-grid">
          {filtered.map((file) => (
            <FileCard key={file.id} file={file} onToggleFavourite={toggleFavourite} />
          ))}
        </div>
      ) : urlFilter === 'favourites' ? (
        // Full Favourites view
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FiHeart size={28} color="var(--error)" style={{ fill: 'var(--error)' }} />
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Favourites</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: -20, marginBottom: 12 }}>Your favourited files grouped by format.</p>
          {favouriteFoldersByType.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {favouriteFoldersByType.map(([type, grpFiles]) => (
                <FolderCard
                  key={type}
                  title={type}
                  count={grpFiles.length}
                  color="var(--error)"
                  onClick={() => navigate(`?favFolder=${encodeURIComponent(type)}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: '20px' }}>
              <FiHeart size={48} color="var(--border)" />
              <h3>No favourites yet</h3>
              <p>Open a file and click the heart icon to add it here.</p>
            </div>
          )}
        </div>
      ) : urlFilter === 'recent' ? (
        // Full Recent view
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FiClock size={28} color="var(--primary)" />
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Recently Opened</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: -20, marginBottom: 12 }}>History of all files you've opened.</p>
          {recentlyOpened.length > 0 ? (
            <div className="file-grid">
              {recentlyOpened.map((file) => (
                <FileCard key={file.id} file={file} onToggleFavourite={toggleFavourite} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: '20px' }}>
              <FiClock size={48} color="var(--border)" />
              <h3>No recent files</h3>
              <p>Files you open will appear here.</p>
            </div>
          )}
        </div>
      ) : (
        // Main 3-Section Layout
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '40px' }}>

          {/* Section 1: Recently Opened */}
          {recentlyOpened.length > 0 && (
            <section className="dashboard-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <FiClock size={22} color="var(--primary)" />
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Recently Opened</h2>
              </div>
              <div
                className="horizontal-scroll"
                style={{
                  display: 'flex',
                  gap: '20px',
                  overflowX: 'auto',
                  paddingBottom: '16px',
                  scrollbarWidth: 'thin'
                }}
              >
                {recentlyOpened.slice(0, 8).map((file) => (
                  <div key={file.id} style={{ minWidth: '240px', flex: '0 0 auto' }}>
                    <FileCard file={file} onToggleFavourite={toggleFavourite} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Favourites by Type (only show if any exist) */}
          {favouriteFoldersByType.length > 0 && (
            <section className="dashboard-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <FiHeart size={22} color="var(--error)" style={{ fill: 'var(--error)' }} />
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Favourite Files</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {favouriteFoldersByType.map(([type, grpFiles]) => (
                  <FolderCard
                    key={type}
                    title={type}
                    count={grpFiles.length}
                    color="var(--error)"
                    onClick={() => navigate(`?favFolder=${encodeURIComponent(type)}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: User Categories */}
          <section className="dashboard-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <FiFolder size={22} color="var(--primary)" style={{ fill: 'var(--primary)', fillOpacity: 0.2 }} />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Your Categories</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {categoryFolders.map(([category, grpFiles]) => (
                <FolderCard
                  key={category}
                  title={category}
                  count={grpFiles.length}
                  color={getCategoryStyles(category, theme).text}
                  onClick={() => navigate(`?categoryFolder=${encodeURIComponent(category)}`)}
                />
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
