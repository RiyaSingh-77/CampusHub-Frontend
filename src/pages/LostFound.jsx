import { useState, useEffect, useRef } from 'react';
import './LostFound.css';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/lost-found`;

const CATEGORIES = [
  'All Categories','Electronics','ID/Cards','Bags',
  'Keys','Books','Clothing','Stationery','Other'
];

export default function LostFound() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState('all');
  const [category, setCategory] = useState('All Categories');
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(null);
  const [viewItem, setViewItem]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  // Image upload state
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    title:'', description:'', category:'', location:'',
    date:'', name:'', phone:''
  });

  useEffect(() => { fetchItems(); }, [filter, category, search]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (category !== 'All Categories') params.append('category', category);
      if (search) params.append('search', search);
      const res  = await fetch(`${API}?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setItems(json.data);
    } catch (err) {
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function resetModal() {
    setSubmitted(false);
    setShowModal(null);
    setForm({ title:'', description:'', category:'', location:'', date:'', name:'', phone:'' });
    clearImage();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);

      const formData = new FormData();
      Object.entries({ ...form, type: showModal }).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      const res  = await fetch(API, { method: 'POST', body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setSubmitted(true);
      fetchItems();
      setTimeout(resetModal, 1800);
    } catch (err) {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResolve(id) {
    try {
      await fetch(`${API}/${id}/resolve`, { method: 'PATCH' });
      setViewItem(null);
      fetchItems();
    } catch {
      alert('Failed to mark as resolved.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setViewItem(null);
      fetchItems();
    } catch {
      alert('Failed to delete item.');
    }
  }

  return (
    <div className="lf-page">
      {/* Hero */}
      <div className="lf-hero">
        <div className="lf-hero-icon">🔍</div>
        <h1>Lost &amp; Found</h1>
        <p>Lost something on campus? Found an item? Post it here and help fellow NITHians reconnect with their belongings.</p>
      </div>

      {/* Controls */}
      <div className="lf-controls">
        <div className="lf-filters">
          {['all','lost','found'].map(f => (
            <button
              key={f}
              className={`lf-filter-btn${filter===f?' active':''} ${f}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="lf-search-row">
          <div className="lf-search-wrap">
            <span className="lf-search-icon">🔎</span>
            <input
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="lf-actions">
        <button className="lf-btn-lost"  onClick={() => setShowModal('lost')}>+ Report Lost Item</button>
        <button className="lf-btn-found" onClick={() => setShowModal('found')}>+ Report Found Item</button>
      </div>

      {/* Grid */}
      {loading && <div className="lf-status">Loading items...</div>}
      {error   && <div className="lf-status lf-error">{error}</div>}

      {!loading && !error && (
        <div className="lf-grid">
          {items.length === 0 && (
            <div className="lf-empty">No items found. Try adjusting your filters.</div>
          )}
          {items.map(item => (
            <div key={item._id} className="lf-card" onClick={() => setViewItem(item)}>
              <div className="lf-card-img-wrap">
                {item.image
                  ? <img src={item.image} alt={item.title} />
                  : <div className="lf-no-img">📦</div>
                }
                <span className={`lf-badge ${item.type}`}>{item.type.toUpperCase()}</span>
                <span className="lf-cat-badge">{item.category}</span>
                {item.resolved && <span className="lf-resolved-badge">✓ Resolved</span>}
              </div>
              <div className="lf-card-body">
                <h3>{item.title}</h3>
                <p className="lf-desc">{item.description}</p>
                <div className="lf-meta">
                  <span>📍 {item.location}</span>
                  <span>🗓 {item.date || item.createdAt?.slice(0,10)}</span>
                </div>
                <div className="lf-contact">👤 {item.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <div className="lf-overlay" onClick={e => e.target.classList.contains('lf-overlay') && resetModal()}>
          <div className="lf-modal">
            <button className="lf-modal-close" onClick={resetModal}>✕</button>
            <h2>Report {showModal === 'lost' ? 'Lost' : 'Found'} Item</h2>
            {submitted ? (
              <div className="lf-success">✅ Item posted successfully!</div>
            ) : (
              <form onSubmit={handleSubmit} className="lf-form">
                <div className="lf-form-row">
                  <div className="lf-form-group full">
                    <label>Title *</label>
                    <input required placeholder="e.g. Blue Backpack" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                </div>

                <div className="lf-form-group full">
                  <label>Description</label>
                  <textarea rows={3} placeholder="Describe the item in detail..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="lf-form-row">
                  <div className="lf-form-group">
                    <label>Category *</label>
                    <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      <option value="">Select</option>
                      {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="lf-form-group">
                    <label>{showModal === 'lost' ? 'Last Seen Location' : 'Found Location'} *</label>
                    <input required placeholder="e.g. Central Library" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                  </div>
                </div>

                <div className="lf-form-row">
                  <div className="lf-form-group">
                    <label>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                  </div>
                  <div className="lf-form-group">
                    <label>Image</label>
                    {/* Hidden native file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <div className="lf-img-preview-wrap">
                        <img src={imagePreview} alt="preview" className="lf-img-preview" />
                        <button type="button" className="lf-img-clear" onClick={clearImage}>✕ Remove</button>
                      </div>
                    ) : (
                      <div
                        className="lf-upload-zone"
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      >
                        <span className="lf-upload-icon">📷</span>
                        <span className="lf-upload-text">Click or drag &amp; drop</span>
                        <span className="lf-upload-hint">PNG, JPG, WEBP</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lf-section-label">YOUR CONTACT DETAILS</div>
                <div className="lf-form-row">
                  <div className="lf-form-group">
                    <label>Name *</label>
                    <input required placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="lf-form-group">
                    <label>Phone *</label>
                    <input required placeholder="9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className={`lf-submit ${showModal}`} disabled={submitting}>
                  {submitting ? 'Submitting...' : `Submit ${showModal === 'lost' ? 'Lost' : 'Found'} Report`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewItem && (
        <div className="lf-overlay" onClick={e => e.target.classList.contains('lf-overlay') && setViewItem(null)}>
          <div className="lf-modal lf-view-modal">
            <button className="lf-modal-close" onClick={() => setViewItem(null)}>✕</button>
            <span className={`lf-badge ${viewItem.type} lf-badge-large`}>{viewItem.type.toUpperCase()}</span>
            {viewItem.image && <img src={viewItem.image} alt={viewItem.title} className="lf-view-img" />}
            <h2>{viewItem.title}</h2>
            <p className="lf-view-desc">{viewItem.description}</p>
            <div className="lf-view-meta">
              <div><strong>📍 Location:</strong> {viewItem.location}</div>
              <div><strong>🗓 Date:</strong> {viewItem.date || viewItem.createdAt?.slice(0,10)}</div>
              <div><strong>🏷 Category:</strong> {viewItem.category}</div>
            </div>
            <div className="lf-contact-box">
              <div className="lf-contact-label">Contact Person</div>
              <div className="lf-contact-name">👤 {viewItem.name}</div>
              <div className="lf-contact-phone">📞 {viewItem.phone}</div>
            </div>
            {!viewItem.resolved && (
              <div className="lf-view-actions">
                <button className="lf-resolve-btn" onClick={() => handleResolve(viewItem._id)}>✓ Mark as Resolved</button>
                <button className="lf-delete-btn"  onClick={() => handleDelete(viewItem._id)}>🗑 Delete</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
