import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedBrands,
  onToggleBrand,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  availableBrands = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--primary-navy)', fontSize: '1.05rem' }}>
            <Filter size={18} color="var(--primary-orange)" />
            <span>Filter Materials</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingBottom: '1rem' }}>
          {/* Category */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: selectedCategory === 'all' ? 'var(--primary-navy)' : 'var(--bg-surface)',
                  color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: 'none',
                }}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: selectedCategory === cat.slug ? 'var(--primary-navy)' : 'var(--bg-surface)',
                    color: selectedCategory === cat.slug ? '#FFFFFF' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: 'none',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Brands
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {availableBrands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleBrand(brand)}
                        style={{ accentColor: 'var(--primary-orange)' }}
                      />
                      <span>{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Max Price: ₹{priceRange.toLocaleString()}
            </label>
            <input
              type="range"
              min="200"
              max="70000"
              step="500"
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-orange)' }}
            />
          </div>

          {/* In stock */}
          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '600' }}>
              <span>Ready Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onToggleInStock}
                style={{ accentColor: 'var(--primary-orange)', width: '16px', height: '16px' }}
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
