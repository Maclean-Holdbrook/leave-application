import { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, Check, Shield, Calendar, User, Mail, Key, Briefcase } from 'lucide-react';
import { adminAPI } from '../../services/api';

const StaffCredentialsTab = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getAllCredentials();
      if (response.success) {
        setCredentials(response.data);
      }
    } catch (err) {
      console.error('Error loading credentials:', err);
      setError(err.message || 'Failed to load credentials');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = (credId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [credId]: !prev[credId]
    }));
  };

  const copyToClipboard = async (text, fieldId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading credentials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Staff Credentials</h3>
        <div className="alert alert-danger">
          <Shield size={20} />
          <div>
            <strong>Error</strong>
            <p style={{ margin: 0, marginTop: '0.25rem' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Staff Credentials</h3>
        <div className="alert alert-info">
          <Shield size={20} />
          <div>
            <strong>No Credentials Found</strong>
            <p style={{ margin: 0, marginTop: '0.25rem' }}>
              No staff credentials have been stored yet. Create staff accounts to see their credentials here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ margin: 0 }}>Staff Credentials</h3>
        <button
          className="btn btn-outline btn-sm"
          onClick={loadCredentials}
        >
          Refresh
        </button>
      </div>

      <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
        <Shield size={20} />
        <div>
          <strong>Security Notice</strong>
          <p style={{ margin: 0, marginTop: '0.25rem' }}>
            This page contains sensitive information. Keep these credentials secure and only share with authorized personnel.
          </p>
        </div>
      </div>

      {/* Mobile & Desktop Responsive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
        gap: '1.5rem'
      }}>
        {credentials.map((cred) => {
          const isPasswordVisible = visiblePasswords[cred.id];

          return (
            <div
              key={cred.id}
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <User size={20} style={{ color: 'var(--primary)' }} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{cred.name}</h4>
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: cred.role === 'admin' ? 'var(--danger-light)' : cred.role === 'manager' ? 'var(--warning-light)' : 'var(--success-light)',
                  color: cred.role === 'admin' ? 'var(--danger)' : cred.role === 'manager' ? 'var(--warning)' : 'var(--success)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {cred.role}
                </div>
              </div>

              {/* Credentials Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Email */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem'
                  }}>
                    <Mail size={16} />
                    <span>Email</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{
                      flex: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      wordBreak: 'break-all'
                    }}>
                      {cred.email}
                    </span>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => copyToClipboard(cred.email, `email-${cred.id}`)}
                      style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                    >
                      {copiedField === `email-${cred.id}` ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem'
                  }}>
                    <Key size={16} />
                    <span>Password</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{
                      flex: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      wordBreak: 'break-all'
                    }}>
                      {isPasswordVisible ? cred.plaintext_password : '••••••••••'}
                    </span>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => togglePasswordVisibility(cred.id)}
                      style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                    >
                      {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => copyToClipboard(cred.plaintext_password, `password-${cred.id}`)}
                      style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                    >
                      {copiedField === `password-${cred.id}` ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Department */}
                {cred.department && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      <Briefcase size={16} />
                      <span>Department</span>
                    </div>
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem'
                    }}>
                      {cred.department}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div style={{
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}>
                  <Calendar size={14} />
                  <span>Created: {new Date(cred.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Count */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        Total: {credentials.length} staff {credentials.length === 1 ? 'credential' : 'credentials'}
      </div>
    </div>
  );
};

export default StaffCredentialsTab;
