import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Calendar, LayoutDashboard, Settings } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <Calendar size={28} />
          Life Hospital
        </Link>

        <div className="navbar-menu">
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

        <div className="navbar-user">
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
      </div>
    </nav>
  );
};

export default Navbar;
