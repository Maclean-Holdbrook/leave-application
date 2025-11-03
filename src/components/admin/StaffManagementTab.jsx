import { useState } from 'react';
import { CheckCircle, UserPlus, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { validateEmail } from '../../utils/helpers';

const StaffManagementTab = ({ onStaffCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const departments = [
    'Nursing',
    'Surgery',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Emergency',
    'Pediatrics',
    'Cardiology',
    'Administration'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
    setSuccessMessage('');
    // Clear credentials when user starts filling form for new account
    if (createdCredentials) {
      setCreatedCredentials(null);
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setLoading(true);

    // Validate
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Create staff account
      const { confirmPassword, ...userData } = formData;
      const response = await adminAPI.createStaffAccount(userData);

      if (response.success) {
        // Store credentials for display
        setCreatedCredentials({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department || 'Not assigned'
        });

        setSuccessMessage(`Account created successfully for ${formData.name}`);

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'employee',
          department: ''
        });

        // Notify parent to reload data
        if (onStaffCreated) {
          onStaffCreated();
        }
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to create account' });
    }

    setLoading(false);
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Create Staff Account</h3>

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          <CheckCircle size={20} />
          <div>{successMessage}</div>
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          {errors.general}
        </div>
      )}

      {/* Credentials Display Section */}
      {createdCredentials && (
        <div style={{
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: '#e8f5e9',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid #4caf50'
        }}>
          <h4 style={{
            marginBottom: '1rem',
            color: '#2e7d32',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={24} />
            Account Created Successfully!
          </h4>
          <p style={{ marginBottom: '1.5rem', color: '#555' }}>
            Please save these credentials and share them with the staff member. They will need these to log in.
          </p>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Staff Name:
              </strong>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace'
              }}>
                <span style={{ flex: 1 }}>{createdCredentials.name}</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard(createdCredentials.name, 'name')}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  {copiedField === 'name' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Email (Username):
              </strong>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace'
              }}>
                <span style={{ flex: 1 }}>{createdCredentials.email}</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  {copiedField === 'email' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Password:
              </strong>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace'
              }}>
                <span style={{ flex: 1 }}>{createdCredentials.password}</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  {copiedField === 'password' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Role:
              </strong>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'capitalize'
              }}>
                {createdCredentials.role}
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Department:
              </strong>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-sm)'
              }}>
                {createdCredentials.department}
              </div>
            </div>
          </div>

          <div className="alert alert-info" style={{ marginTop: '1rem', backgroundColor: '#fff9c4', border: '1px solid #fbc02d' }}>
            <strong>Important:</strong> Make sure to save these credentials. The password cannot be retrieved later.
          </div>
        </div>
      )}

      {/* Create Form */}
      <div style={{
        maxWidth: '600px',
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)'
      }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label form-label-required">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label form-label-required">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="email@lifehospital.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label form-label-required">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <div className="form-error">{errors.role}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">
              Department
            </label>
            <select
              id="department"
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select department (optional)</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <div className="form-error">{errors.department}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label form-label-required">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label form-label-required">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm the password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <UserPlus size={20} />
                Create Staff Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffManagementTab;
