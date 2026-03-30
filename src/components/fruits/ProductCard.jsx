import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Orange top bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />

      <div className="p-5 flex flex-col flex-1">
        {/* Emoji icon */}
        <div className="flex items-center justify-center h-20 text-5xl mb-3">
          {product.emoji}
        </div>

        {/* Name */}
        <h3 className="text-center font-semibold text-gray-800 text-base mb-1">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-center text-amber-600 font-bold text-lg mb-4">
          ₹{product.price}
          <span className="text-gray-400 font-normal text-sm">/{product.unit}</span>
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-auto w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;