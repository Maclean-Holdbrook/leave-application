import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LeaveProvider } from './contexts/LeaveContext';
import PrivateRoute from './components/shared/PrivateRoute';
import Login from './components/auth/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { USER_ROLES } from './utils/constants';

// Component to handle role-based default route
const RoleBasedRedirect = () => {
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

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'employee':
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <LeaveProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
                  <EmployeeDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/manager"
              element={
                <PrivateRoute allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                  <ManagerDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Default Route - Role-based redirect */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* 404 Route - Role-based redirect */}
            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </Router>
      </LeaveProvider>
    </AuthProvider>
  );
}

export default App;
