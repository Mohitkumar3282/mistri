import React from 'react';
import { Truck, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * Quick Commerce Product Card (Compact & Mobile Responsive)
 * - Yellow Discount Badge
 * - Clean Contain Product Image
 * - Free Delivery Badge
 * - Product Title & Price / MRP
 * - Assured 2% Cashback Strip
 * - Crisp Green Add / Options / Increment-Decrement Buttons
 */
export const ProductCard = ({ product }) => {
  const { navigateTo, addToCart, cart, updateCartQty, openOptionsModal } = useStore();

  const cartItem = cart.find(
    (item) => item.product?.id === product.id || item.product?.slug === product.slug || item.id === product.id
  );
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => {
    navigateTo('product-details', { product, id: product.id, productId: product.id });
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (product.hasOptions && product.optionsList && product.optionsList.length > 0) {
      openOptionsModal(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateCartQty(product.id, qtyInCart + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateCartQty(product.id, qtyInCart - 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="qc-product-card"
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {/* Top Image Section */}
        <div className="qc-product-img-wrap">
          {/* Top-Left Yellow Discount Tag */}
          {product.discount && (
            <div className="qc-product-discount-tag">
              {product.discount}
            </div>
          )}

          {/* Product Image */}
          <img
            src={product.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'}
            alt={product.name || 'Product'}
            className="qc-product-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400';
            }}
          />
        </div>

        {/* Content Body */}
        <div className="qc-product-body">
          {/* Free Delivery Teal Badge */}
          <div className="qc-delivery-badge">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Truck size={10} strokeWidth={2.5} />
              <span>Free Delivery</span>
            </div>
            <span className="qc-delivery-sub">orders &gt; ₹500</span>
          </div>

          {/* Product Name */}
          <h3
            className="qc-product-title"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price & MRP Row */}
          <div className="qc-product-price-row">
            <span className="qc-price-val">
              ₹ {(Number(product.price) || 0).toLocaleString('en-IN')}
            </span>
            {product.mrp && Number(product.mrp) > (Number(product.price) || 0) && (
              <span className="qc-mrp-val">
                ₹ {Number(product.mrp).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Assured Cashback Strip */}
          <div className="qc-cashback-strip">
            <div className="qc-cashback-coin">🪙</div>
            <div className="qc-cashback-text">
              <span className="qc-cashback-bold">Assured 2% Cashback</span>
              <span className="qc-cashback-sub">On orders above ₹50k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Section */}
      <div className="qc-product-actions">
        {product.hasOptions ? (
          /* Multi-variant button e.g. "25 Options" or "6 Options" */
          <button
            type="button"
            onClick={handleAddClick}
            className="qc-options-btn"
          >
            <span>{product.optionsLabel || `${product.optionsCount || 4} Options`}</span>
          </button>
        ) : qtyInCart > 0 ? (
          /* Quantity Increment / Decrement Counter */
          <div
            onClick={(e) => e.stopPropagation()}
            className="qc-qty-counter"
          >
            <button
              type="button"
              onClick={handleDecrement}
              className="qc-qty-btn-minus"
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="qc-qty-number">
              {qtyInCart}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="qc-qty-btn-plus"
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          /* Single SKU Crisp Green "Add" Button */
          <button
            type="button"
            onClick={handleAddClick}
            className="qc-add-btn"
          >
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
