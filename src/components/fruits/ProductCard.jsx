import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-card__topbar" />
      <div className="product-card__body">

        {/* Show real image if exists, else fallback to emoji */}
        {product.imageUrl ? (
          <img
            src={`http://localhost:5000${product.imageUrl}`}
            alt={product.name}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__emoji">{product.emoji || "🛒"}</div>
        )}

        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">
          ₹{product.price}<span>/{product.unit}</span>
        </p>
        <button className="product-card__btn" onClick={() => onAddToCart(product)}>
          + Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;