import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Icon from '../icons/Icon.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import AnnounceBar from './AnnounceBar.jsx';
import { useCart } from '../../hooks/useCart.js';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const cart = useCart();
  const wishlist = useContext(WishlistContext);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  function submitSearch(event) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <AnnounceBar />
      <div className="nav-row-bg">
        <div className="container nav-row">
          <Link to="/" className="logo">Tinah<span>Store</span></Link>
          <nav className="main-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
          </nav>
          <div className="nav-icons">
            <ThemeToggle />
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((open) => !open)}><Icon name="search" /></button>
            <Link to="/account" className="icon-btn" aria-label="Account">
              {user ? <span className="text-xs font-bold bg-teal-pale text-teal-ink w-6 h-6 rounded-full flex items-center justify-center">{(user.username || user.email).charAt(0).toUpperCase()}</span> : <Icon name="user" />}
            </Link>
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist"><Icon name="heart" />{wishlist.count > 0 && <span className="badge">{wishlist.count}</span>}</Link>
            <Link to="/cart" className="icon-btn" aria-label="Cart"><Icon name="bag" /><span className="badge">{cart.count}</span></Link>
            <button
              className={`icon-btn nav-toggle ${navOpen ? 'active' : ''}`}
              aria-label="Menu"
              onClick={() => setNavOpen((open) => !open)}
              style={{ position: 'relative', zIndex: 110 }}
            >
              <Icon name={navOpen ? "x" : "menu"} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <nav className={`mobile-nav ${navOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={() => setNavOpen(false)}>Home</NavLink>
        <NavLink to="/shop" onClick={() => setNavOpen(false)}>Shop</NavLink>
        <a href="/#about" onClick={() => setNavOpen(false)}>About</a>
        <a href="/#contact" onClick={() => setNavOpen(false)}>Contact</a>
      </nav>

      {/* Mobile Nav Overlay */}
      {navOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setNavOpen(false)}
        ></div>
      )}
      <div className={`search-bar ${searchOpen ? 'open' : ''}`}>
        <form className="container" onSubmit={submitSearch}>
          <Icon name="search" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search totes, crossbody, backpacks..."
          />
          <button className="btn btn-primary btn-sm" type="submit">Search</button>
          <button className="icon-btn" aria-label="Close search" onClick={() => setSearchOpen(false)}><Icon name="x" /></button>
        </form>
      </div>
    </header>
  );
}
