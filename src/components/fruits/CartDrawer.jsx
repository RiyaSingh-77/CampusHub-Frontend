import React from "react";

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove, onDecrease, onIncrease, onClear }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-drawer__header">
          <h2>🛒 Your Cart</h2>
          <button className="cart-drawer__close" onClick={onClose}>×</button>
        </div>

        <div className="cart-drawer__items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div>🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="cart-item__emoji">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item__img"
                    />
                  ) : (
                    item.emoji || "🛒"
                  )}
                </span>

                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__price">₹{item.price}/{item.unit}</div>
                </div>

                <div className="cart-item__right">
                  <div className="cart-item__qty-controls">
                    <button className="cart-qty-btn" onClick={() => onDecrease(item.id)}>−</button>
                    <span className="cart-qty-num">{item.qty}</span>
                    <button className="cart-qty-btn" onClick={() => onIncrease(item)}>+</button>
                  </div>
                  <div className="cart-item__total">₹{item.price * item.qty}</div>
                  <button className="cart-item__remove" onClick={() => onRemove(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button className="cart-drawer__order-btn">Place Order</button>
            <button className="cart-drawer__clear-btn" onClick={onClear}>Clear cart</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;