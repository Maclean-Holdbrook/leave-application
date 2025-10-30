import { createContext, useContext, useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import { useAuth } from './AuthContext';

const LeaveContext = createContext(null);

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

export const LeaveProvider = ({ children }) => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load leave types when component mounts
  useEffect(() => {
    if (user) {
      loadLeaveTypes();
    }
  }, [user]);

  const loadLeaveTypes = async () => {
    try {
      const response = await leaveAPI.getLeaveTypes();
      if (response.success) {
        setLeaveTypes(response.data);
      }
    } catch (err) {
      console.error('Error loading leave types:', err);
    }
  };

  // Submit leave request
  const submitLeaveRequest = async (requestData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await leaveAPI.submitRequest(requestData);

      if (response.success) {
        // Reload requests after submission
        await loadUserRequests();
        setLoading(false);
        return { success: true, data: response.data };
      }

      setLoading(false);
      return { success: false, error: 'Failed to submit leave request' };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Load user's leave requests
  const loadUserRequests = async () => {
    try {
      const response = await leaveAPI.getMyRequests();
      if (response.success) {
        setLeaveRequests(response.data);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
    }
  };

  // Approve leave request (Manager)
  const approveLeaveRequest = async (requestId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await leaveAPI.approveRequest(requestId);

      if (response.success) {
        // Reload requests after approval
        if (user.role === 'manager' || user.role === 'admin') {
          await loadTeamRequests();
        }
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Failed to approve request' };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Reject leave request (Manager)
  const rejectLeaveRequest = async (requestId, rejectionReason) => {
    setLoading(true);
    setError(null);

    try {
      const response = await leaveAPI.rejectRequest(requestId, rejectionReason);

      if (response.success) {
        // Reload requests after rejection
        if (user.role === 'manager' || user.role === 'admin') {
          await loadTeamRequests();
        }
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Failed to reject request' };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Load team requests (Manager)
  const loadTeamRequests = async (status = null) => {
    try {
      const response = await leaveAPI.getTeamRequests(status);
      if (response.success) {
        setLeaveRequests(response.data);
      }
    } catch (err) {
      console.error('Error loading team requests:', err);
    }
  };

  // Load all requests (Admin)
  const loadAllRequests = async () => {
    try {
      const response = await leaveAPI.getAllRequests();
      if (response.success) {
        setLeaveRequests(response.data);
      }
    } catch (err) {
      console.error('Error loading all requests:', err);
    }
  };

  // Load user's leave balance
  const loadUserBalance = async () => {
    try {
      const response = await leaveAPI.getMyBalance();
      if (response.success) {
        setLeaveBalances(response.data);
      }
    } catch (err) {
      console.error('Error loading balance:', err);
    }
  };

  // Get user's leave requests
  const getUserLeaveRequests = (userId) => {
    return leaveRequests.filter(request => request.user_id === parseInt(userId));
  };

  // Get pending requests for manager
  const getManagerPendingRequests = (managerId) => {
    return leaveRequests.filter(
      request => request.manager_id === parseInt(managerId) && request.status === 'pending'
    );
  };

  // Get all team requests for manager
  const getManagerTeamRequests = (managerId) => {
    return leaveRequests.filter(request => request.manager_id === parseInt(managerId));
  };

  // Get user balance
  const getUserBalance = (userId) => {
    return leaveBalances;
  };

  // Get all leave requests
  const getAllLeaveRequests = () => {
    return leaveRequests;
  };

  const value = {
    leaveRequests,
    leaveBalances,
    leaveTypes,
    loading,
    error,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getUserLeaveRequests,
    getManagerPendingRequests,
    getManagerTeamRequests,
    getUserBalance,
    getAllLeaveRequests,
    loadUserRequests,
    loadTeamRequests,
    loadAllRequests,
    loadUserBalance,
    loadLeaveTypes
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
};
