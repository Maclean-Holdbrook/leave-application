import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLeave } from '../../contexts/LeaveContext';
import { calculateWorkingDays } from '../../utils/helpers';
import { X, Send } from 'lucide-react';

const NewLeaveRequest = ({ onClose }) => {
  const { user } = useAuth();
  const { submitLeaveRequest, getUserBalance, leaveTypes } = useLeave();
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const userBalance = getUserBalance(user?.id || '');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.leave_type_id) {
      newErrors.leave_type_id = 'Please select a leave type';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      if (end < start) {
        newErrors.end_date = 'End date must be after start date';
      }

      // Check if start date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.start_date = 'Start date cannot be in the past';
      }

      // Check balance
      if (formData.leave_type_id && userBalance && userBalance.length > 0) {
        const workingDays = calculateWorkingDays(formData.start_date, formData.end_date);
        const balance = userBalance.find(b => b.leave_type_id === parseInt(formData.leave_type_id));

        if (balance && workingDays > balance.remaining_days) {
          newErrors.general = `Insufficient balance. You only have ${balance.remaining_days} days remaining for this leave type`;
        }
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = 'Please provide a reason (at least 10 characters)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const result = await submitLeaveRequest(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setErrors({ general: result.error });
    }
  };

  const workingDays = formData.start_date && formData.end_date
    ? calculateWorkingDays(formData.start_date, formData.end_date)
    : 0;

  const selectedBalance = formData.leave_type_id && userBalance && userBalance.length > 0
    ? userBalance.find(b => b.leave_type_id === parseInt(formData.leave_type_id))
    : null;

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', color: 'var(--success-color)', marginBottom: '1rem' }}>
              ✓
            </div>
            <h3 style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }}>
              Request Submitted!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your leave request has been submitted successfully and is awaiting approval.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">New Leave Request</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.general && (
              <div className="alert alert-danger">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="leave_type_id" className="form-label form-label-required">
                Leave Type
              </label>
              <select
                id="leave_type_id"
                name="leave_type_id"
                className="form-select"
                value={formData.leave_type_id}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select leave type</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.leave_type_id && <div className="form-error">{errors.leave_type_id}</div>}

              {selectedBalance && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem'
                }}>
                  Available: {selectedBalance.remaining_days} of {selectedBalance.total_days} days
                </div>
              )}
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label htmlFor="start_date" className="form-label form-label-required">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  className="form-input"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.start_date && <div className="form-error">{errors.start_date}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="end_date" className="form-label form-label-required">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className="form-input"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={loading}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                />
                {errors.end_date && <div className="form-error">{errors.end_date}</div>}
              </div>
            </div>

            {workingDays > 0 && (
              <div className="alert alert-info">
                <strong>Duration:</strong> {workingDays} working {workingDays === 1 ? 'day' : 'days'}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="reason" className="form-label form-label-required">
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                className="form-textarea"
                placeholder="Please provide a detailed reason for your leave request..."
                value={formData.reason}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.reason && <div className="form-error">{errors.reason}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeaveRequest;
