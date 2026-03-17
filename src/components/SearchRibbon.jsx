import { FiSearch, FiFilter, FiClock, FiHeart } from 'react-icons/fi';

const FILE_TYPES = ['All', 'PDF', 'Images', 'Documents', 'Videos', 'Audio', 'Presentations', 'Spreadsheets', 'Archives', 'Code', 'Other'];

export default function SearchRibbon({ filters, setFilters, categories }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="search-ribbon" style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      marginBottom: '24px',
      border: '1.5px solid #111111',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Top Row: Main Search */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-card)',
          borderRadius: '8px',
          padding: '0 16px',
          border: '1.5px solid #111111'
        }}>
          <FiSearch color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search files by name or tags..."
            value={filters.query}
            onChange={(e) => handleChange('query', e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '12px',
              fontSize: '1rem',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Bottom Row: Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiFilter color="var(--text-muted)" />
          <select
            className="form-input"
            style={{ width: 'auto', padding: '6px 12px', paddingRight: '32px', height: 'auto' }}
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {FILE_TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Formats' : t}</option>)}
          </select>
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', padding: '6px 12px', paddingRight: '32px', height: 'auto' }}
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={{ flex: 1 }}></div>

        {/* Toggles */}
        <button
          className={`btn ${filters.showFavourites ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', gap: '6px' }}
          onClick={() => handleChange('showFavourites', !filters.showFavourites)}
        >
          <FiHeart style={{ fill: filters.showFavourites ? 'currentColor' : 'none' }} />
          Favourites
        </button>
      </div>
    </div>
  );
}
