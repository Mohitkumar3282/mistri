import React from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const FilterSidebar = ({
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
  categories = [],
  maxPriceLimit = 70000,
}) => {
  const categoryList = categories && categories.length > 0 ? categories : CATEGORIES;

  return (
    <aside style={{ width: '260px', flexShrink: 0 }} className="hide-on-mobile">
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)', position: 'sticky', top: '130px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--primary-navy)', fontSize: '0.95rem' }}>
            <Filter size={16} color="var(--primary-orange)" />
            <span>Filter Materials</span>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--primary-orange)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Category Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
            Categories
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                borderRadius: '4px',
                background: selectedCategory === 'all' ? 'var(--navy-subtle)' : 'transparent',
                color: selectedCategory === 'all' ? 'var(--primary-navy)' : 'var(--text-primary)',
                fontWeight: selectedCategory === 'all' ? '700' : '500',
                fontSize: '0.835rem',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              All Categories
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                style={{
                  textAlign: 'left',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  background: selectedCategory === cat.slug ? 'var(--navy-subtle)' : 'transparent',
                  color: selectedCategory === cat.slug ? 'var(--primary-navy)' : 'var(--text-primary)',
                  fontWeight: selectedCategory === cat.slug ? '700' : '500',
                  fontSize: '0.835rem',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Brand Checkboxes */}
        {availableBrands.length > 0 && (
          <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
              Brands
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
              {availableBrands.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.835rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleBrand(brand)}
                      style={{ accentColor: 'var(--primary-orange)', width: '15px', height: '15px' }}
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Price Filter Slider / Buckets */}
        <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
            Max Price: ₹{priceRange.toLocaleString()}
          </label>
          <input
            type="range"
            min="200"
            max={maxPriceLimit}
            step="500"
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary-orange)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>₹200</span>
            <span>₹{maxPriceLimit.toLocaleString()}+</span>
          </div>
        </div>

        {/* 4. In-Stock Only Toggle */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.835rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
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
    </aside>
  );
};

export default FilterSidebar;
