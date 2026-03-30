import React from "react";

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove, onClear }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-amber-500 text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">🛒 Your Cart</h2>
          <button onClick={onClose} className="text-white hover:text-amber-100 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-16">
              <div className="text-5xl mb-3">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 border border-amber-100"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-amber-600 text-sm">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">₹{item.price * item.qty}</p>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-400 hover:text-red-600 text-xs mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-amber-100 space-y-3">
            <div className="flex justify-between font-bold text-gray-800 text-lg">
              <span>Total</span>
              <span className="text-amber-600">₹{total}</span>
            </div>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
              Place Order
            </button>
            <button
              onClick={onClear}
              className="w-full text-gray-400 hover:text-gray-600 text-sm"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;