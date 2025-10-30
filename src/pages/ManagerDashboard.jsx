import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLeave } from '../contexts/LeaveContext';
import Navbar from '../components/shared/Navbar';
import LeaveRequestCard from '../components/shared/LeaveRequestCard';
import RejectModal from '../components/manager/RejectModal';
import { Users, Clock, CheckCircle, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { getManagerPendingRequests, getManagerTeamRequests, approveLeaveRequest, rejectLeaveRequest, loadTeamRequests } = useLeave();
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user && (user.role === 'manager' || user.role === 'admin')) {
      loadTeamRequests();
    }
  }, [user]);

  const pendingRequests = getManagerPendingRequests(user?.id || '');
  const allTeamRequests = getManagerTeamRequests(user?.id || '');

  const filteredRequests = filterStatus === 'all'
    ? allTeamRequests
    : allTeamRequests.filter(req => req.status === filterStatus);

  const approvedCount = allTeamRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = allTeamRequests.filter(req => req.status === 'rejected').length;

  const handleApprove = async (requestId) => {
    if (window.confirm('Are you sure you want to approve this leave request?')) {
      await approveLeaveRequest(requestId);
    }
  };

  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason) => {
    if (selectedRequestId) {
      await rejectLeaveRequest(selectedRequestId, reason);
      setShowRejectModal(false);
      setSelectedRequestId(null);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getLeaveOnDate = (date) => {
    const approvedLeaves = allTeamRequests.filter(req => req.status === 'approved');
    const dateStr = date.toISOString().split('T')[0];

    return approvedLeaves.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      const checkDate = new Date(dateStr);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const leavesOnDay = getLeaveOnDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <div className="calendar-day-number">{day}</div>
          {leavesOnDay.length > 0 && (
            <div className="calendar-day-leaves">
              {leavesOnDay.slice(0, 2).map((leave, idx) => (
                <div key={idx} className="calendar-leave-item" title={leave.user_name}>
                  {leave.user_name}
                </div>
              ))}
              {leavesOnDay.length > 2 && (
                <div className="calendar-leave-more">
                  +{leavesOnDay.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4>{monthName}</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-sm btn-outline" onClick={() => navigateMonth(-1)}>
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => setCurrentMonth(new Date())}>
              Today
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => navigateMonth(1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-header">Sun</div>
          <div className="calendar-header">Mon</div>
          <div className="calendar-header">Tue</div>
          <div className="calendar-header">Wed</div>
          <div className="calendar-header">Thu</div>
          <div className="calendar-header">Fri</div>
          <div className="calendar-header">Sat</div>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Team Leave Management</h1>
            <p className="page-subtitle">
              Review and manage leave requests from your team members
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card-wrapper stat-warning">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Pending Requests</div>
                <div className="stat-number">{pendingRequests.length}</div>
                <div className="stat-trend trend-up">
                  Requires attention
                </div>
              </div>
              <div className="stat-icon icon-warning">
                <Clock />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-success">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Approved</div>
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
                <div className="stat-title">Rejected</div>
                <div className="stat-number">{rejectedCount}</div>
              </div>
              <div className="stat-icon icon-danger">
                <Filter />
              </div>
            </div>
          </div>

          <div className="stat-card-wrapper stat-primary">
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-title">Total Requests</div>
                <div className="stat-number">{allTeamRequests.length}</div>
              </div>
              <div className="stat-icon icon-primary">
                <Users />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <div className="alert alert-warning">
            <Clock size={20} />
            <span>
              You have <strong>{pendingRequests.length}</strong> pending leave {pendingRequests.length === 1 ? 'request' : 'requests'} that require your attention.
            </span>
          </div>
        )}

        {/* Leave Requests */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Team Leave Requests</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('pending')}
              >
                <Clock size={16} />
                Pending ({pendingRequests.length})
              </button>
              <button
                className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('approved')}
              >
                <CheckCircle size={16} />
                Approved
              </button>
              <button
                className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('rejected')}
              >
                Rejected
              </button>
              <button
                className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
            </div>
          </div>
          <div className="card-body">
            {filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
                {filteredRequests
                  .sort((a, b) => {
                    // Sort pending first, then by applied date
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return new Date(b.appliedDate) - new Date(a.appliedDate);
                  })
                  .map(request => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      showEmployee={true}
                      showActions={true}
                      onApprove={handleApprove}
                      onReject={handleRejectClick}
                    />
                  ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Users size={48} />
                </div>
                <div className="empty-state-title">No Requests Found</div>
                <p className="empty-state-text">
                  {filterStatus === 'pending'
                    ? "There are no pending leave requests at the moment."
                    : `No ${filterStatus} leave requests found.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Team Calendar */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Team Calendar
            </h3>
          </div>
          <div className="card-body">
            {renderCalendar()}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <RejectModal
          onClose={() => {
            setShowRejectModal(false);
            setSelectedRequestId(null);
          }}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
