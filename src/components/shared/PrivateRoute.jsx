import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Helper function to get role-based dashboard route
const getRoleDashboard = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'manager':
      return '/manager';
    case 'employee':
    default:
      return '/dashboard';
  }
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's appropriate dashboard based on their role
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return children;
};

export default PrivateRoute;
