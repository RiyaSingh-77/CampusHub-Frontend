import { useState, useEffect } from 'react';
import api from '../api';
import './Marketplace.css';

const CATEGORIES = ['All Items', 'Lab Coats', 'Drafters', 'Books', 'Clothes', 'Electronics', 'Miscellaneous'];
const TYPES      = ['All Types', 'For Sale', 'For Lending'];

const conditionColors = {
  'like-new': { bg: '#E6F4EA', color: '#2D7A4A', label: 'Like New' },
  'good':     { bg: '#FFF0DC', color: '#8B5E1A', label: 'Good' },
  'fair':     { bg: '#FDECEA', color: '#A32D2D', label: 'Fair' },
};

// Frontend label → DB value (used when filtering)
const categoryMap = {
  'Lab Coats':     'lab-coat',
  'Drafters':      'drafter',
  'Books':         'books',
  'Clothes':       'clothes',
  'Electronics':   'electronics',
  'Miscellaneous': 'other',
};

// DB value → Frontend label (used when displaying cards)
const categoryLabel = {
  'lab-coat':    'Lab Coat',
  'drafter':     'Drafter',
  'books':       'Books',
  'clothes':     'Clothes',
  'electronics': 'Electronics',
  'other':       'Miscellaneous',
};

const typeMap = {
  'For Sale':    'sell',
  'For Lending': 'lend',
};

export default function Marketplace() {
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All Items');
  const [type, setType]           = useState('All Types');
  const [showModal, setShowModal] = useState(false);
  const [posting, setPosting]     = useState(false);
  const [form, setForm]           = useState({
    title: '', description: '', category: 'lab-coat',
    type: 'sell', price: '', condition: 'like-new',
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const params = {};
        if (category !== 'All Items') params.category = categoryMap[category];
        if (type !== 'All Types')     params.type     = typeMap[type];
        if (search)                   params.search   = search;

        const res = await api.get('/listings', { params });
        setListings(res.data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [search, category, type]);

  const handlePost = async e => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post('/listings', { ...form, price: Number(form.price) });
      setShowModal(false);
      setForm({ title: '', description: '', category: 'lab-coat', type: 'sell', price: '', condition: 'like-new' });
      const res = await api.get('/listings');
      setListings(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post listing. Are you logged in?');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="marketplace">
      <div className="container">

        {/* Page header */}
        <div className="page-header">
          <div className="page-header__icon">🛍️</div>
          <div>
            <h1 className="page-title">Student Marketplace</h1>
            <p className="page-sub">Buy, sell & lend lab coats, drafters, books, and more. Save money, reduce waste.</p>
          </div>
        </div>

        {/* Search + post */}
        <div className="marketplace__toolbar">
          <div className="search-box">
            <span className="search-box__icon">🔍</span>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-box__input"
            />
          </div>
          <button className="post-btn" onClick={() => setShowModal(true)}>
            <span>＋</span> Post an Item
          </button>
        </div>

        {/* Category pills */}
        <div className="filter-row">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`pill ${category === c ? 'pill--active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Type pills */}
        <div className="filter-row filter-row--sm">
          {TYPES.map(t => (
            <button
              key={t}
              className={`pill pill--sm ${type === t ? 'pill--active' : ''}`}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="empty-state">
            <p>Loading listings...</p>
          </div>
        )}

        {/* Listings grid */}
        {!loading && (
          <div className="listings-grid">
            {listings.map(l => {
              const cond = conditionColors[l.condition] || conditionColors['good'];
              const isForSale = l.type === 'sell';
              const date = new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

              return (
                <div key={l._id} className="listing-card">
                  <div className="listing-card__top">
                    <h3 className="listing-card__title">{l.title}</h3>
                    <span className={`listing-card__type ${isForSale ? 'type--sale' : 'type--lend'}`}>
                      {isForSale ? 'FOR SALE' : 'FOR LENDING'}
                    </span>
                  </div>

                  <p className="listing-card__desc">{l.description}</p>

                  <div className="listing-card__price-row">
                    <span className="listing-card__price">₹ {l.price}</span>
                    <span className="listing-card__condition" style={{ background: cond.bg, color: cond.color }}>
                      {cond.label}
                    </span>
                  </div>

                  <div className="listing-card__meta">
                    {/* ✅ categoryLabel maps DB value → readable label */}
                    <span>🏷️ {categoryLabel[l.category] || l.category}</span>
                    <span>{date}</span>
                  </div>

                  <div className="listing-card__divider" />

                  <div className="listing-card__seller">
                    <div>
                      <p className="listing-card__seller-label">Seller details</p>
                      <p className="listing-card__seller-name">
                        👤 {l.seller?.name || 'Unknown'}
                      </p>
                    </div>
                    <span className="listing-card__seller-year">
                      {l.seller?.year ? `${l.seller.year} Year` : ''}
                    </span>
                  </div>

                  <button
                    className="listing-card__contact"
                    onClick={() => alert(`Contact ${l.seller?.name} at: ${l.seller?.phone || 'No phone available'}`)}
                  >
                    Contact Seller
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>🔍</span>
            <p>No listings found. Try a different search or category.</p>
          </div>
        )}

        {/* Post Listing Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal__header">
                <h2 className="modal__title">Post an Item</h2>
                <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <form onSubmit={handlePost} className="modal__form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Chemistry Lab Coat - White"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Condition details, size, how long used..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="modal__row">
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      <option value="lab-coat">Lab Coat</option>
                      <option value="drafter">Drafter</option>
                      <option value="books">Books</option>
                      <option value="clothes">Clothes</option>
                      <option value="electronics">Electronics</option>
                      <option value="other">Miscellaneous</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="sell">For Sale</option>
                      <option value="lend">For Lending</option>
                    </select>
                  </div>
                </div>

                <div className="modal__row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="150"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Condition</label>
                    <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={posting}>
                  {posting ? 'Posting...' : 'Post Listing'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
