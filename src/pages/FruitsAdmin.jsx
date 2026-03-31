import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./FruitsAdmin.css";

const CATEGORIES = ["fruits", "vegetables", "grocery"];

const FruitsAdmin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    category: "fruits",
    emoji: "",
    image: null,
  });

  const fetchProducts = () => {
    api.get("/products")
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("unit", form.unit);
    formData.append("category", form.category);
    formData.append("emoji", form.emoji || "🛒");
    if (form.image) formData.append("image", form.image);

    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Product added successfully! ✅");
      setForm({ name: "", price: "", unit: "", category: "fruits", emoji: "", image: null });
      e.target.reset();
      fetchProducts();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="fadmin-page">
      <div className="fadmin-container">

        {/* Header */}
        <div className="fadmin-header">
          <div>
            <h1 className="fadmin-title">🛒 Manage Products</h1>
            <p className="fadmin-subtitle">Add items that appear on the Fruits & Grocery page</p>
          </div>
          <button className="fadmin-back-btn" onClick={() => navigate("/fruits")}>
            ← View Store
          </button>
        </div>

        {/* Form */}
        <div className="fadmin-card">
          <h2 className="fadmin-card-title">Add New Product</h2>
          <form onSubmit={handleSubmit} className="fadmin-form">
            <div className="fadmin-form-row">
              <div className="fadmin-field">
                <label>Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Apples"
                  required
                />
              </div>
              <div className="fadmin-field">
                <label>Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 180"
                  required
                />
              </div>
            </div>

            <div className="fadmin-form-row">
              <div className="fadmin-field">
                <label>Unit *</label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="e.g. kg, pack, dozen"
                  required
                />
              </div>
              <div className="fadmin-field">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fadmin-form-row">
              <div className="fadmin-field">
                <label>Emoji (fallback if no image)</label>
                <input
                  name="emoji"
                  value={form.emoji}
                  onChange={handleChange}
                  placeholder="e.g. 🍎"
                />
              </div>
              <div className="fadmin-field">
                <label>Product Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="fadmin-file-input"
                />
              </div>
            </div>

            {error && <p className="fadmin-error">{error}</p>}
            {success && <p className="fadmin-success">{success}</p>}

            <button type="submit" className="fadmin-submit-btn" disabled={submitting}>
              {submitting ? "Adding..." : "+ Add Product"}
            </button>
          </form>
        </div>

        {/* Existing Products Table */}
        <div className="fadmin-card">
          <h2 className="fadmin-card-title">Existing Products ({products.length})</h2>
          {loading ? (
            <p className="fadmin-loading">Loading...</p>
          ) : (
            <div className="fadmin-table-wrapper">
              <table className="fadmin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Unit</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="fadmin-thumb"
                          />
                        ) : (
                          <span className="fadmin-emoji">{p.emoji}</span>
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>{p.unit}</td>
                      <td>
                        <span className={`fadmin-badge fadmin-badge--${p.category}`}>
                          {p.category}
                        </span>
                      </td>
                      <td>
                        <button
                          className="fadmin-delete-btn"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FruitsAdmin;