import { useState, useEffect } from 'react';
import api from '../api';
import './Marketplace.css';

const CATEGORIES = ['All Items', 'Lab Coats', 'Drafters', 'Books', 'Clothes', 'Miscellaneous'];
const TYPES      = ['All Types', 'For Sale', 'For Lending'];

const conditionColors = {
  'like-new': { bg: '#E6F4EA', color: '#2D7A4A', label: 'Like New' },
  'good':     { bg: '#FFF0DC', color: '#8B5E1A', label: 'Good' },
  'fair':     { bg: '#FDECEA', color: '#A32D2D', label: 'Fair' },
};

const categoryMap = {
  'Lab Coats':     'lab-coat',
  'Drafters':      'drafter',
  'Books':         'books',
  'Clothes':       'clothes',
  'Miscellaneous': 'other',
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
          <button className="post-btn">
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
                    <span>🏷️ {l.category}</span>
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

                  <button className="listing-card__contact">Contact Seller</button>
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

      </div>
    </div>
  );
}