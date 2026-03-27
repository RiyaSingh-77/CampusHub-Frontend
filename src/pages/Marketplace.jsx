import { useState } from 'react';
import './Marketplace.css';

const CATEGORIES = ['All Items', 'Lab Coats', 'Drafters', 'Books', 'Clothes', 'Miscellaneous'];
const TYPES      = ['All Types', 'For Sale', 'For Lending'];

const SAMPLE_LISTINGS = [
  {
    id: 1, title: 'Chemistry Lab Coat - White', type: 'For Sale',
    desc: 'Used for 1 semester only. Clean, no stains. Size M.',
    price: 150, condition: 'Like New', category: 'Lab Coats',
    seller: 'Aarav Sharma', year: '2nd Year', branch: 'CSE', date: '25 Mar',
  },
  {
    id: 2, title: 'Engineering Drawing Drafter Set', type: 'For Sale',
    desc: 'Complete drafter set with mini drafter, compass, and scales. Barely used.',
    price: 250, condition: 'Good', category: 'Drafters',
    seller: 'Priya Patel', year: '2nd Year', branch: 'ME', date: '24 Mar',
  },
  {
    id: 3, title: 'Data Structures Textbook', type: 'For Lending',
    desc: 'Cormen CLRS 3rd edition. Lending for semester, returnable.',
    price: 30, condition: 'Good', category: 'Books',
    seller: 'Rohan Verma', year: '3rd Year', branch: 'CSE', date: '23 Mar',
  },
  {
    id: 4, title: 'Lab Coat - Size L', type: 'For Sale',
    desc: 'Barely worn, brought wrong size. Perfect condition.',
    price: 120, condition: 'Like New', category: 'Lab Coats',
    seller: 'Sneha Rao', year: '1st Year', branch: 'ECE', date: '22 Mar',
  },
];

const conditionColors = {
  'Like New': { bg: '#E6F4EA', color: '#2D7A4A' },
  'Good':     { bg: '#FFF0DC', color: '#8B5E1A' },
  'Fair':     { bg: '#FDECEA', color: '#A32D2D' },
};

export default function Marketplace() {
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All Items');
  const [type, setType]       = useState('All Types');

  const filtered = SAMPLE_LISTINGS.filter(l => {
    const matchSearch   = l.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All Items' || l.category === category;
    const matchType     = type === 'All Types' || l.type === type;
    return matchSearch && matchCategory && matchType;
  });

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

        {/* Listings grid */}
        <div className="listings-grid">
          {filtered.map(l => {
            const cond = conditionColors[l.condition] || conditionColors['Good'];
            return (
              <div key={l.id} className="listing-card">
                <div className="listing-card__top">
                  <h3 className="listing-card__title">{l.title}</h3>
                  <span className={`listing-card__type ${l.type === 'For Sale' ? 'type--sale' : 'type--lend'}`}>
                    {l.type.toUpperCase()}
                  </span>
                </div>

                <p className="listing-card__desc">{l.desc}</p>

                <div className="listing-card__price-row">
                  <span className="listing-card__price">₹ {l.price}</span>
                  <span className="listing-card__condition" style={{ background: cond.bg, color: cond.color }}>
                    {l.condition}
                  </span>
                </div>

                <div className="listing-card__meta">
                  <span>🏷️ {l.category}</span>
                  <span>{l.date}</span>
                </div>

                <div className="listing-card__divider" />

                <div className="listing-card__seller">
                  <div>
                    <p className="listing-card__seller-label">Seller details</p>
                    <p className="listing-card__seller-name">👤 {l.seller}</p>
                  </div>
                  <span className="listing-card__seller-year">{l.year}</span>
                </div>

                <button className="listing-card__contact">Contact Seller</button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>🔍</span>
            <p>No listings found. Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
