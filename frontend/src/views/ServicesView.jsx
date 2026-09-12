import React from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

export const ServicesView = ({
  services,
  loading,
  category,
  setCategory,
  search,
  setSearch,
  onBookService,
}) => {
  const categories = [
    'All',
    'Plumbing',
    'Electrical',
    'AC Repair',
    'Carpentry',
    'Painting',
    'Appliance Repair',
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Explore All Home Services
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Choose from over 50+ specialized repair and installation services handled by verified master technicians.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-card)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '2.5rem',
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '0.5rem' }}>
            <Filter size={14} /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.9rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.4rem 0.8rem',
          minWidth: '260px',
        }}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              color: '#fff',
              fontSize: '0.9rem',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Service List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No services found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try adjusting your search criteria or category filter.
          </p>
          <button onClick={() => { setCategory('All'); setSearch(''); }} className="btn btn-secondary btn-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} onBookNow={onBookService} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesView;
