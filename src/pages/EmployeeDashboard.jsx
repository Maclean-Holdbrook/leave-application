import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLeave } from '../contexts/LeaveContext';
import Navbar from '../components/shared/Navbar';
import LeaveRequestCard from '../components/shared/LeaveRequestCard';
import NewLeaveRequest from '../components/employee/NewLeaveRequest';
import { Calendar, Clock, CheckCircle, XCircle, Plus, FileText } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { getUserLeaveRequests, getUserBalance, loadUserRequests, loadUserBalance, leaveBalances } = useLeave();
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user) {
      loadUserRequests();
      loadUserBalance();
    }
  }, [user]);

  const userRequests = getUserLeaveRequests(user?.id || '');
  const userBalance = getUserBalance(user?.id || '');

  const filteredRequests = filterStatus === 'all'
    ? userRequests
    : userRequests.filter(req => req.status === filterStatus);

  const pendingCount = userRequests.filter(req => req.status === 'pending').length;
  const approvedCount = userRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = userRequests.filter(req => req.status === 'rejected').length;

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="page-subtitle">
              Welcome back, {user?.name}! Manage your leave requests here.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewRequestModal(true)}
          >
            <Plus size={20} />
            New Leave Request
          </button>
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card-wrapper stat-warning">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Pending Requests</div>
                <div className="stat-number">{pendingCount}</div>
              </div>
              <div className="stat-icon icon-warning">
                <Clock />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-success">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Approved Requests</div>
                <div className="stat-number">{approvedCount}</div>
              </div>
              <div className="stat-icon icon-success">
                <CheckCircle />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-danger">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Rejected Requests</div>
                <div className="stat-number">{rejectedCount}</div>
              </div>
              <div className="stat-icon icon-danger">
                <XCircle />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-primary">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Total Requests</div>
                <div className="stat-number">{userRequests.length}</div>
              </div>
              <div className="stat-icon icon-primary">
                <FileText />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          {/* Leave Balance */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Leave Balance</h3>
            </div>
            <div className="card-body">
              {userBalance && userBalance.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userBalance.map((balance) => (
                    <div key={balance.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                          {balance.leave_type_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Used: {balance.used_days} days
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: balance.remaining_days < 5 ? 'var(--danger-color)' : 'var(--success-color)'
                        }}>
                          {balance.remaining_days}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          of {balance.total_days} remaining
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No leave balance information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="quick-action-card"
                  style={{ width: '100%', border: '2px dashed var(--border-color)' }}
                  onClick={() => setShowNewRequestModal(true)}
                >
                  <div className="quick-action-icon">
                    <Plus />
                  </div>
                  <div className="quick-action-title">Submit New Request</div>
                  <div className="quick-action-desc">Apply for leave</div>
                </button>

                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--primary-color)'
                }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    <strong>Next Holiday:</strong>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Check the team calendar for upcoming holidays and team availability.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Requests History */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">My Leave Requests</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </button>
              <button
                className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('approved')}
              >
                Approved
              </button>
              <button
                className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>
          <div className="card-body">
            {filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
                {filteredRequests.map(request => (
                  <LeaveRequestCard
                    key={request.id}
                    request={request}
                    showEmployee={false}
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FileText size={48} />
                </div>
                <div className="empty-state-title">No Leave Requests</div>
                <p className="empty-state-text">
                  {filterStatus === 'all'
                    ? "You haven't submitted any leave requests yet."
                    : `No ${filterStatus} leave requests found.`}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowNewRequestModal(true)}
                >
                  <Plus size={20} />
                  Submit Your First Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewRequestModal && (
        <NewLeaveRequest onClose={() => setShowNewRequestModal(false)} />
      )}
    </div>
  );
};

export default EmployeeDashboard;
