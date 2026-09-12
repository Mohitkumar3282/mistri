import React, { useState, useMemo, useEffect } from 'react';
import { Filter, ArrowUpDown, Layers, SlidersHorizontal, ChevronRight, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export const ProductListingView = () => {
  const { viewParams, navigateTo } = useStore();
  const initialSlug = viewParams?.slug || 'all';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialSlug);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(70000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (viewParams?.slug) {
      setSelectedCategory(viewParams.slug);
    }
  }, [viewParams?.slug]);

  // Active Category Details
  const activeCategory = CATEGORIES.find((c) => c.slug === selectedCategory);

  // Available brands in the dataset
  const availableBrands = useMemo(() => {
    const brands = new Set(
      PRODUCTS.filter((p) => selectedCategory === 'all' || p.categorySlug === selectedCategory).map((p) => p.brand)
    );
    return Array.from(brands);
  }, [selectedCategory]);

  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange(70000);
    setInStockOnly(false);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category Filter
      if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
        return false;
      }
      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Price Filter
      if (product.price > priceRange) {
        return false;
      }
      // In Stock Filter
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default popular
    });
  }, [selectedCategory, selectedBrands, priceRange, inStockOnly, sortBy]);

  return (
    <div className="container page-container">
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Home</button>
        <span>/</span>
        <button onClick={() => navigateTo('categories')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Categories</button>
        <span>/</span>
        <span style={{ color: 'var(--primary-navy)', fontWeight: '700' }}>
          {activeCategory ? activeCategory.name : 'All Construction Materials'}
        </span>
      </div>

      {/* Category Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #123A63 0%, #0B2947 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          borderLeft: '5px solid var(--primary-orange)',
        }}
      >
        <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
          {activeCategory ? activeCategory.name : 'All Construction Materials'}
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: '0.925rem', maxWidth: '720px' }}>
          {activeCategory
            ? activeCategory.description
            : 'Explore certified construction materials with wholesale contractor pricing and crane/dumper site delivery.'}
        </p>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Desktop Filter Sidebar */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedBrands={selectedBrands}
          onToggleBrand={handleToggleBrand}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          inStockOnly={inStockOnly}
          onToggleInStock={() => setInStockOnly(!inStockOnly)}
          onResetFilters={handleResetFilters}
          availableBrands={availableBrands}
        />

        {/* Products Column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top Control Bar: Count + Mobile Filter Trigger + Sort Dropdown */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: 'var(--primary-navy)' }}>{filteredProducts.length}</strong> construction materials
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="btn btn-secondary btn-sm hide-on-desktop"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <SlidersHorizontal size={14} color="var(--primary-orange)" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.825rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '4rem 2rem',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--light-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--primary-orange)' }}>
                <Filter size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                No materials matched your filter criteria
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Try adjusting your price filter range or uncheck specific brand filters to view all available stock.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-primary"
                style={{ display: 'inline-flex', gap: '6px' }}
              >
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBrands={selectedBrands}
        onToggleBrand={handleToggleBrand}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        inStockOnly={inStockOnly}
        onToggleInStock={() => setInStockOnly(!inStockOnly)}
        onResetFilters={handleResetFilters}
        availableBrands={availableBrands}
      />
    </div>
  );
};

export default ProductListingView;
