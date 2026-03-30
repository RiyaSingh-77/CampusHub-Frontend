import React, { useState, useMemo } from "react";
import ProductCard from "../components/fruits/ProductCard";
import CartDrawer from "../components/fruits/CartDrawer";
import { products } from "../data/fruitsData";

const CATEGORIES = [
  { key: "all", label: "All Items", emoji: "" },
  { key: "fruits", label: "Fruits", emoji: "🍎" },
  { key: "vegetables", label: "Vegetables", emoji: "🥦" },
  { key: "grocery", label: "Grocery", emoji: "🛒" },
];

const FruitsGrocery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-amber-200 rounded-full px-4 py-1.5 text-sm text-amber-700 font-medium mb-4 shadow-sm">
          🚚 Free delivery to your hostel
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Fresh Fruits &{" "}
          <span className="text-amber-500">Grocery</span> Delivery
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Get fresh fruits, vegetables, and daily essentials delivered right to
          your hostel room.
        </p>
      </div>

      {/* Filter + Cart bar */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur border-b border-amber-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat.key
                    ? "bg-amber-500 text-white border-amber-500 shadow"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                }`}
              >
                {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded-full shadow transition-colors"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 mt-16">No items found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
        onClear={() => setCart([])}
      />
    </div>
  );
};

export default FruitsGrocery;