import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Calendar, LayoutDashboard, Settings, Menu, X } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <Calendar size={28} />
          <span className="navbar-brand-text">Life Hospital</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu navbar-menu-desktop">
          <Link to="/dashboard" className="navbar-link">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {user?.role === 'manager' && (
            <Link to="/manager" className="navbar-link">
              <User size={18} />
              Team Requests
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="navbar-link">
              <Settings size={18} />
              Admin
            </Link>
          )}
        </div>

        {/* Desktop User Menu */}
        <div className="navbar-user navbar-user-desktop">
          <span className="navbar-username">{user?.name}</span>
          <div className="navbar-avatar">
            {getInitials(user?.name)}
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline"
            style={{ marginLeft: '1rem' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`navbar-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
        />

        {/* Mobile Menu Slide Drawer */}
        <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-mobile-user">
            <div className="navbar-avatar">
              {getInitials(user?.name)}
            </div>
            <span className="navbar-username">{user?.name}</span>
          </div>

          <Link to="/dashboard" className="navbar-mobile-link" onClick={closeMobileMenu}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {user?.role === 'manager' && (
            <Link to="/manager" className="navbar-mobile-link" onClick={closeMobileMenu}>
              <User size={18} />
              Team Requests
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="navbar-mobile-link" onClick={closeMobileMenu}>
              <Settings size={18} />
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="navbar-mobile-link navbar-mobile-logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
