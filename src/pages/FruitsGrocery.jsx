import React, { useState, useMemo } from "react";
import ProductCard from "../components/fruits/ProductCard";
import CartDrawer from "../components/fruits/CartDrawer";
import { products } from "../data/fruitsData";
import "./FruitsGrocery.css";

const CATEGORIES = [
  { key: "all", label: "All Items" },
  { key: "fruits", label: "🍎 Fruits" },
  { key: "vegetables", label: "🥦 Vegetables" },
  { key: "grocery", label: "🛒 Grocery" },
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
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="fruits-page">
      {/* Hero */}
      <div className="fruits-hero">
        <div className="fruits-hero__badge">🚚 Free delivery to your hostel</div>
        <h1 className="fruits-hero__title">
          Fresh Fruits & <span>Grocery</span> Delivery
        </h1>
        <p className="fruits-hero__subtitle">
          Get fresh fruits, vegetables, and daily essentials delivered right to your hostel room.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="fruits-filterbar">
        <div className="fruits-filterbar__inner">
          <div className="fruits-filterbar__tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`fruits-tab ${activeCategory === cat.key ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <button className="fruits-cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {totalItems > 0 && <span className="fruits-cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="fruits-grid-wrapper">
        <div className="fruits-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
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