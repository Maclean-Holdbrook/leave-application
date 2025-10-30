import { Calendar, Clock } from 'lucide-react';
import { formatDate, getStatusBadgeClass, formatLeaveDuration, getInitials } from '../../utils/helpers';

const LeaveRequestCard = ({ request, showActions, onApprove, onReject, showEmployee = true }) => {
  return (
    <div className="leave-request-card">
      <div className="leave-request-header">
        {showEmployee && (
          <div className="leave-request-employee">
            <div className="leave-request-avatar">
              {getInitials(request.user_name || request.userName)}
            </div>
            <div className="leave-request-info">
              <h4>{request.user_name || request.userName}</h4>
              <p>{request.department}</p>
            </div>
          </div>
        )}
        <span className={`badge ${getStatusBadgeClass(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="leave-request-body">
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>{request.leave_type_name || request.leaveType}</strong>
        </div>

        <div className="leave-dates">
          <Calendar size={16} />
          <span>
            {formatDate(request.start_date || request.startDate)} - {formatDate(request.end_date || request.endDate)}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            ({formatLeaveDuration(request.start_date || request.startDate, request.end_date || request.endDate)})
          </span>
        </div>

        <div className="leave-dates">
          <Clock size={16} />
          <span>Applied on {formatDate(request.created_at || request.appliedDate)}</span>
        </div>

        {request.reason && (
          <div className="leave-reason">
            <strong>Reason:</strong> {request.reason}
          </div>
        )}

        {request.status === 'rejected' && (request.rejection_reason || request.rejectionReason) && (
          <div className="alert alert-danger" style={{ marginTop: '0.5rem', padding: '0.5rem' }}>
            <strong>Rejection Reason:</strong> {request.rejection_reason || request.rejectionReason}
          </div>
        )}
      </div>

      {showActions && request.status === 'pending' && (
        <div className="leave-request-footer">
          <div className="leave-actions">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onApprove(request.id)}
            >
              Approve
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onReject(request.id)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestCard;
