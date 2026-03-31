import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function DropdownMenu({ label, items, pathname, onClose }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = items.some(i => i.to === pathname);

  return (
    <li className="navbar__dropdown" ref={ref}>
      <button
        className={`navbar__link navbar__dropdown-btn ${isActive ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {label}
        <span className={`navbar__dropdown-arrow ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && (
        <ul className="navbar__dropdown-menu">
          {items.map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`navbar__dropdown-item ${pathname === item.to ? 'active' : ''}`}
                onClick={() => { setOpen(false); onClose(); }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const academicsLinks = [
    { to: '/timetable', label: 'Timetable' },
    { to: '/holidays',  label: 'Holidays & Calendar' },
  ];

  const campusLinks = [
    { to: '/mess',        label: 'Mess Menu' },
    { to: '/fruits',      label: 'Fruits & Grocery' },
    { to: '/events',      label: 'Events' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/lost-found',  label: 'Lost & Found' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🏛️</span>
          CampusHub
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              className={`navbar__link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <DropdownMenu
            label="Academics"
            items={academicsLinks}
            pathname={pathname}
            onClose={() => setMenuOpen(false)}
          />

          <DropdownMenu
            label="Campus Life"
            items={campusLinks}
            pathname={pathname}
            onClose={() => setMenuOpen(false)}
          />

          {(user?.role === 'vendor' || user?.role === 'admin') && (
            <li>
              <Link
                to="/fruits/admin"
                className={`navbar__link ${pathname === '/fruits/admin' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Manage Products
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar__actions">
          {user ? (
            <>
              <div className="navbar__user">
                <span className="navbar__avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="navbar__username">{user.name}</span>
              </div>
              <button className="btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-ghost">Log in</Link>
              <Link to="/signup" className="btn-amber">Sign up</Link>
            </>
          )}
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}