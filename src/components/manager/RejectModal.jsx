import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const RejectModal = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim() || reason.trim().length < 10) {
      setError('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    onConfirm(reason);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reject Leave Request</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert alert-warning">
              <AlertCircle size={20} />
              <span>
                Please provide a clear reason for rejecting this leave request.
                The employee will be able to see this reason.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="reason" className="form-label form-label-required">
                Rejection Reason
              </label>
              <textarea
                id="reason"
                className="form-textarea"
                placeholder="E.g., Insufficient coverage during this period, overlaps with critical project deadline, etc."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                style={{ minHeight: '120px' }}
              />
              {error && <div className="form-error">{error}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectModal;
