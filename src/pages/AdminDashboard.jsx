import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLeave } from '../contexts/LeaveContext';
import { adminAPI, leaveAPI } from '../services/api';
import Navbar from '../components/shared/Navbar';
import LeaveRequestCard from '../components/shared/LeaveRequestCard';
import RejectModal from '../components/manager/RejectModal';
import { Users, FileText, TrendingUp, Calendar, Settings, BarChart, Edit2, Save, X, CheckCircle, XCircle, UserPlus, Eye, EyeOff } from 'lucide-react';
import { validateEmail } from '../utils/helpers';

// Staff Management Tab Component
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

// Employee Balances Tab Component
const EmployeeBalancesTab = ({ employees, leaveTypes, onBalanceUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeBalances, setEmployeeBalances] = useState([]);
  const [editingBalance, setEditingBalance] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loadingBalances, setLoadingBalances] = useState(false);

  const loadEmployeeBalance = async (userId) => {
    setLoadingBalances(true);
    try {
      const response = await adminAPI.getUserBalance(userId);
      if (response.success) {
        setEmployeeBalances(response.data);
      }
    } catch (err) {
      console.error('Error loading employee balance:', err);
      setError('Failed to load employee balances');
    }
    setLoadingBalances(false);
  };

  const handleEdit = (balance) => {
    setEditingBalance(balance.leave_type_id);
    setEditForm({
      total_days: balance.total_days,
      used_days: balance.used_days,
      remaining_days: balance.remaining_days
    });
  };

  const handleCancel = () => {
    setEditingBalance(null);
    setEditForm({});
    setError(null);
  };

  const handleSave = async (userId, leaveTypeId) => {
    setSaving(true);
    setError(null);

    try {
      const response = await adminAPI.updateLeaveBalance(userId, leaveTypeId, editForm);
      if (response.success) {
        setEditingBalance(null);
        setEditForm({});
        // Reload the employee's balance to show updated data
        await loadEmployeeBalance(userId);
        onBalanceUpdate();
      } else {
        setError('Failed to update balance');
      }
    } catch (err) {
      setError(err.message || 'Failed to update balance');
    }
    setSaving(false);
  };

  const handleChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const newForm = { ...editForm, [field]: numValue };

    // Auto-calculate remaining days
    if (field === 'total_days' || field === 'used_days') {
      newForm.remaining_days = newForm.total_days - newForm.used_days;
    }

    setEditForm(newForm);
  };

  if (employees.length === 0) {
    return (
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Employee Leave Balances</h3>
        <div className="alert alert-info">
          <Calendar size={20} />
          <div>
            <strong>No Employees Found</strong>
            <p style={{ margin: 0, marginTop: '0.25rem' }}>
              No employees are registered in the system yet. Once users register, you'll be able to manage their leave balances here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Employee Leave Balances</h3>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td><strong>{employee.name}</strong></td>
                <td>{employee.department}</td>
                <td>{employee.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      if (selectedEmployee?.id === employee.id) {
                        setSelectedEmployee(null);
                        setEmployeeBalances([]);
                      } else {
                        setSelectedEmployee(employee);
                        loadEmployeeBalance(employee.id);
                      }
                    }}
                  >
                    {selectedEmployee?.id === employee.id ? 'Hide' : 'View'} Balances
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>
            Leave Balances for {selectedEmployee.name}
          </h4>

          {loadingBalances ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Total Days</th>
                    <th>Used Days</th>
                    <th>Remaining Days</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.map(leaveType => {
                    const isEditing = editingBalance === leaveType.id;
                    // Find existing balance or use defaults
                    const existingBalance = employeeBalances.find(b => b.leave_type_id === leaveType.id);
                    const balance = existingBalance || {
                      leave_type_id: leaveType.id,
                      total_days: leaveType.days_per_year,
                      used_days: 0,
                      remaining_days: leaveType.days_per_year
                    };

                  return (
                    <tr key={leaveType.id}>
                      <td><strong>{leaveType.name}</strong></td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '100px' }}
                            value={editForm.total_days}
                            onChange={(e) => handleChange('total_days', e.target.value)}
                            min="0"
                          />
                        ) : (
                          balance.total_days
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '100px' }}
                            value={editForm.used_days}
                            onChange={(e) => handleChange('used_days', e.target.value)}
                            min="0"
                          />
                        ) : (
                          balance.used_days
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '100px' }}
                            value={editForm.remaining_days}
                            disabled
                          />
                        ) : (
                          balance.remaining_days
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleSave(selectedEmployee.id, leaveType.id)}
                              disabled={saving}
                            >
                              <Save size={14} />
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={handleCancel}
                              disabled={saving}
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEdit(balance)}
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { getAllLeaveRequests, leaveBalances, leaveTypes, loadAllRequests, approveLeaveRequest, rejectLeaveRequest } = useLeave();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyEditForm, setPolicyEditForm] = useState({});

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAllRequests(),
        loadUsers(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const allRequests = getAllLeaveRequests();
  const pendingCount = allRequests.filter(req => req.status === 'pending').length;
  const approvedCount = allRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = allRequests.filter(req => req.status === 'rejected').length;

  const employees = users.filter(u => u.role === 'employee');
  const managers = users.filter(u => u.role === 'manager');

  // Handle approve request
  const handleApprove = async (requestId) => {
    setActionLoading(true);
    const result = await approveLeaveRequest(requestId);
    if (result.success) {
      await loadAllData();
    }
    setActionLoading(false);
  };

  // Handle reject request
  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async (rejectionReason) => {
    if (!selectedRequest) return;

    setActionLoading(true);
    const result = await rejectLeaveRequest(selectedRequest.id, rejectionReason);
    if (result.success) {
      setRejectModalOpen(false);
      setSelectedRequest(null);
      await loadAllData();
    }
    setActionLoading(false);
  };

  // Calculate statistics
  const totalLeaveDays = allRequests
    .filter(req => req.status === 'approved')
    .reduce((sum, req) => {
      // Use working_days if available, otherwise calculate
      const days = req.working_days || Math.ceil(
        (new Date(req.end_date || req.endDate) - new Date(req.start_date || req.startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
      return sum + days;
    }, 0);

  const avgLeaveDaysPerEmployee = employees.length > 0
    ? Math.round(totalLeaveDays / employees.length)
    : 0;

  // Handle policy editing
  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy.id);
    setPolicyEditForm({
      name: policy.name,
      days_per_year: policy.days_per_year,
      description: policy.description
    });
  };

  const handleCancelPolicyEdit = () => {
    setEditingPolicy(null);
    setPolicyEditForm({});
  };

  const handleSavePolicy = async (policyId) => {
    // Note: We would need a backend endpoint to update leave policies
    // For now, this is a placeholder
    alert('Leave policy update functionality requires a backend endpoint. Please implement PUT /api/admin/leave-types/:id');
    handleCancelPolicyEdit();
  };

  const handlePolicyFormChange = (field, value) => {
    setPolicyEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Report generation utilities
  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateAnnualReport = () => {
    const currentYear = new Date().getFullYear();

    // CSV Header
    let csv = 'Employee Name,Department,Leave Type,Start Date,End Date,Working Days,Status,Submission Date,Reason\n';

    // Add data rows
    allRequests.forEach(request => {
      const user = users.find(u => u.id === request.user_id);
      const leaveType = leaveTypes.find(t => t.id === request.leave_type_id);

      const row = [
        user?.name || 'Unknown',
        user?.department || 'N/A',
        leaveType?.name || 'Unknown',
        new Date(request.start_date).toLocaleDateString(),
        new Date(request.end_date).toLocaleDateString(),
        request.working_days || 'N/A',
        request.status,
        new Date(request.created_at).toLocaleDateString(),
        `"${(request.reason || '').replace(/"/g, '""')}"`
      ].join(',');

      csv += row + '\n';
    });

    downloadCSV(`Annual_Leave_Report_${currentYear}.csv`, csv);
  };

  const generateDepartmentReport = () => {
    const currentYear = new Date().getFullYear();

    // Group requests by department
    const departmentStats = {};

    allRequests.forEach(request => {
      const user = users.find(u => u.id === request.user_id);
      const dept = user?.department || 'Unknown';

      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          totalRequests: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          totalDays: 0,
          employees: new Set()
        };
      }

      departmentStats[dept].totalRequests++;
      departmentStats[dept][request.status]++;

      if (request.status === 'approved') {
        departmentStats[dept].totalDays += request.working_days || 0;
      }

      if (user?.id) {
        departmentStats[dept].employees.add(user.id);
      }
    });

    // CSV Header
    let csv = 'Department,Total Employees,Total Requests,Approved,Pending,Rejected,Total Leave Days,Avg Days per Employee\n';

    // Add data rows
    Object.keys(departmentStats).sort().forEach(dept => {
      const stats = departmentStats[dept];
      const employeeCount = stats.employees.size;
      const avgDays = employeeCount > 0 ? (stats.totalDays / employeeCount).toFixed(1) : '0';

      const row = [
        dept,
        employeeCount,
        stats.totalRequests,
        stats.approved,
        stats.pending,
        stats.rejected,
        stats.totalDays,
        avgDays
      ].join(',');

      csv += row + '\n';
    });

    downloadCSV(`Department_Leave_Report_${currentYear}.csv`, csv);
  };

  const generateEmployeeUtilizationReport = () => {
    const currentYear = new Date().getFullYear();

    // CSV Header
    let csv = 'Employee Name,Department,Email,Total Requests,Approved,Pending,Rejected,Total Days Used,Annual Allocation\n';

    // Process each employee
    employees.forEach(employee => {
      const employeeRequests = allRequests.filter(req => req.user_id === employee.id);

      const totalRequests = employeeRequests.length;
      const approved = employeeRequests.filter(req => req.status === 'approved').length;
      const pending = employeeRequests.filter(req => req.status === 'pending').length;
      const rejected = employeeRequests.filter(req => req.status === 'rejected').length;

      const totalDaysUsed = employeeRequests
        .filter(req => req.status === 'approved')
        .reduce((sum, req) => sum + (req.working_days || 0), 0);

      // Calculate total annual allocation from leave types
      const annualAllocation = leaveTypes.reduce((sum, lt) => sum + (lt.days_per_year || 0), 0);

      const row = [
        employee.name,
        employee.department || 'N/A',
        employee.email,
        totalRequests,
        approved,
        pending,
        rejected,
        totalDaysUsed,
        annualAllocation
      ].join(',');

      csv += row + '\n';
    });

    // Add summary row
    csv += '\n';
    csv += 'SUMMARY\n';
    csv += `Total Employees,${employees.length}\n`;
    csv += `Total Requests,${allRequests.length}\n`;
    csv += `Total Approved Days,${totalLeaveDays}\n`;
    csv += `Average Days per Employee,${avgLeaveDaysPerEmployee}\n`;

    downloadCSV(`Employee_Utilization_Report_${currentYear}.csv`, csv);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">
              System-wide leave management and analytics
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card-wrapper stat-primary">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Total Employees</div>
                <div className="stat-number">{employees.length}</div>
              </div>
              <div className="stat-icon icon-primary">
                <Users />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-warning">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Pending Requests</div>
                <div className="stat-number">{pendingCount}</div>
              </div>
              <div className="stat-icon icon-warning">
                <FileText />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-success">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Approved This Year</div>
                <div className="stat-number">{approvedCount}</div>
              </div>
              <div className="stat-icon icon-success">
                <TrendingUp />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-primary">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Avg Days/Employee</div>
                <div className="stat-number">{avgLeaveDaysPerEmployee}</div>
              </div>
              <div className="stat-icon icon-primary">
                <BarChart />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="card-header">
            {/* Desktop Tabs */}
            <div className="admin-tabs-desktop" style={{ display: 'flex', gap: '0.5rem', borderBottom: 'none' }}>
              <button
                className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'staff' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('staff')}
              >
                <UserPlus size={16} />
                Staff Management
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('requests')}
              >
                <FileText size={16} />
                Leave Requests
                {pendingCount > 0 && (
                  <span className="badge badge-pending" style={{ marginLeft: '0.5rem' }}>
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'policies' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('policies')}
              >
                <Settings size={16} />
                Leave Policies
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'balances' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('balances')}
              >
                <Users size={16} />
                Employee Balances
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('reports')}
              >
                <BarChart size={16} />
                Reports
              </button>
            </div>

            {/* Mobile Dropdown */}
            <div className="admin-tabs-mobile">
              <select
                className="form-select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="overview">Overview</option>
                <option value="staff">Staff Management</option>
                <option value="requests">Leave Requests {pendingCount > 0 ? `(${pendingCount})` : ''}</option>
                <option value="policies">Leave Policies</option>
                <option value="balances">Employee Balances</option>
                <option value="reports">Reports</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ marginBottom: '1.5rem' }}>System Overview</h3>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={20} />
                      Staff Overview
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Employees:</span>
                        <strong>{employees.length}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Managers:</span>
                        <strong>{managers.length}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Departments:</span>
                        <strong>{employees.length > 0 ? new Set(employees.map(u => u.department)).size : 0}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={20} />
                      Request Statistics
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Requests:</span>
                        <strong>{allRequests.length}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Approval Rate:</span>
                        <strong>
                          {allRequests.length > 0
                            ? `${Math.round((approvedCount / allRequests.length) * 100)}%`
                            : '0%'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Rejection Rate:</span>
                        <strong>
                          {allRequests.length > 0
                            ? `${Math.round((rejectedCount / allRequests.length) * 100)}%`
                            : '0%'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                  <Settings size={20} />
                  <div>
                    <strong>System Health</strong>
                    <p style={{ margin: 0, marginTop: '0.25rem' }}>
                      All systems operational. {pendingCount} requests awaiting manager approval.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Management Tab */}
            {activeTab === 'staff' && (
              <StaffManagementTab onStaffCreated={loadAllData} />
            )}

            {/* Leave Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h3 style={{ marginBottom: '1.5rem' }}>All Leave Requests</h3>

                {allRequests.length === 0 ? (
                  <div className="alert alert-info">
                    <FileText size={20} />
                    <div>
                      <strong>No Leave Requests</strong>
                      <p style={{ margin: 0, marginTop: '0.25rem' }}>
                        No leave requests have been submitted yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Filter Buttons */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('requests')}
                      >
                        All Requests ({allRequests.length})
                      </button>
                    </div>

                    {/* Requests Grid */}
                    <div className="requests-grid">
                      {allRequests.map((request) => (
                        <div key={request.id} className="leave-request-item">
                          <div className="request-header">
                            <div>
                              <h4>{request.user_name || users.find(u => u.id === request.user_id)?.name || 'Unknown User'}</h4>
                              <p className="request-department">
                                {request.department || users.find(u => u.id === request.user_id)?.department}
                              </p>
                            </div>
                            <span className={`badge badge-${request.status}`}>
                              {request.status}
                            </span>
                          </div>

                          <div className="request-details">
                            <div className="detail-item">
                              <span className="detail-label">Leave Type:</span>
                              <span className="detail-value">
                                {leaveTypes.find(t => t.id === request.leave_type_id)?.name || 'Unknown'}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Duration:</span>
                              <span className="detail-value">
                                {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Days:</span>
                              <span className="detail-value">{request.working_days} working days</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Reason:</span>
                              <span className="detail-value">{request.reason}</span>
                            </div>

                            {request.rejection_reason && (
                              <div className="detail-item">
                                <span className="detail-label">Rejection Reason:</span>
                                <span className="detail-value" style={{ color: 'var(--danger)' }}>
                                  {request.rejection_reason}
                                </span>
                              </div>
                            )}
                          </div>

                          {request.status === 'pending' && (
                            <div className="request-actions">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(request.id)}
                                disabled={actionLoading}
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(request)}
                                disabled={actionLoading}
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Leave Policies Tab */}
            {activeTab === 'policies' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>Leave Policies</h3>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Days Per Year</th>
                        <th>Carry Over</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveTypes.map(policy => {
                        const isEditing = editingPolicy === policy.id;
                        return (
                          <tr key={policy.id}>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  className="form-input"
                                  value={policyEditForm.name}
                                  onChange={(e) => handlePolicyFormChange('name', e.target.value)}
                                />
                              ) : (
                                <strong>{policy.name}</strong>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="form-input"
                                  style={{ width: '100px' }}
                                  value={policyEditForm.days_per_year}
                                  onChange={(e) => handlePolicyFormChange('days_per_year', e.target.value)}
                                  min="0"
                                />
                              ) : (
                                policy.days_per_year
                              )}
                            </td>
                            <td>
                              {policy.carry_over ? (
                                <span className="badge badge-approved">
                                  Yes {policy.max_carry_over ? `(Max: ${policy.max_carry_over})` : ''}
                                </span>
                              ) : (
                                <span className="badge badge-rejected">No</span>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <textarea
                                  className="form-textarea"
                                  value={policyEditForm.description}
                                  onChange={(e) => handlePolicyFormChange('description', e.target.value)}
                                  rows="2"
                                />
                              ) : (
                                policy.description
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleSavePolicy(policy.id)}
                                  >
                                    <Save size={14} />
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={handleCancelPolicyEdit}
                                  >
                                    <X size={14} />
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEditPolicy(policy)}
                                >
                                  <Edit2 size={14} />
                                  Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Employee Balances Tab */}
            {activeTab === 'balances' && (
              <EmployeeBalancesTab
                employees={employees}
                leaveTypes={leaveTypes}
                onBalanceUpdate={loadAllData}
              />
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h3 style={{ marginBottom: '1.5rem' }}>Leave Reports & Analytics</h3>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                      Total Leave Days (Approved)
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                      {totalLeaveDays}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                      days this year
                    </div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                      Average per Employee
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                      {avgLeaveDaysPerEmployee}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                      days per person
                    </div>
                  </div>
                </div>

                <div className="alert alert-info">
                  <BarChart size={20} />
                  <div>
                    <strong>Report Generation</strong>
                    <p style={{ margin: 0, marginTop: '0.25rem' }}>
                      Export detailed reports for payroll, compliance, and HR analytics.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" onClick={generateAnnualReport}>
                    Download Annual Report
                  </button>
                  <button className="btn btn-outline" onClick={generateDepartmentReport}>
                    Department-wise Report
                  </button>
                  <button className="btn btn-outline" onClick={generateEmployeeUtilizationReport}>
                    Employee Utilization Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {rejectModalOpen && (
          <RejectModal
            isOpen={rejectModalOpen}
            onClose={() => {
              setRejectModalOpen(false);
              setSelectedRequest(null);
            }}
            onSubmit={handleRejectSubmit}
            requestDetails={selectedRequest}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
