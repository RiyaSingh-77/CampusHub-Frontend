import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

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

  const links = [
    { to: '/',            label: 'Home' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/timetable',   label: 'Timetable' },
    { to: '/events',      label: 'Events' },
    { to: '/mess',        label: 'Mess Menu' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🏛️</span>
          CampusHub
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`navbar__link ${pathname === l.to ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
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