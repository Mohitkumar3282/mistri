import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export const WishlistView = () => {
  const { wishlist, navigateTo, addToCart, toggleWishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '3.5rem 2rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--light-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary-orange)' }}>
            <Heart size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '2rem' }}>
            Save cement, steel, tiles, and tools to track prices and quickly add to project orders.
          </p>
          <button
            onClick={() => navigateTo('categories')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', gap: '6px' }}
          >
            <span>Explore Materials</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header-row" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">
            Saved Construction Materials ({wishlist.length})
          </h1>
          <p className="page-subtitle">
            Materials saved for upcoming construction phases & project quotations.
          </p>
        </div>

        <button
          onClick={() => {
            wishlist.forEach((p) => addToCart(p, 1));
          }}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', gap: '6px' }}
        >
          <ShoppingCart size={15} />
          <span>Move All to Cart</span>
        </button>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistView;
