// API Service - Connects frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!isJson) {
    // If not JSON, likely an error page or CORS issue
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error(
      `API Error: Received HTML instead of JSON. Check if backend is running and CORS is configured. Status: ${response.status}`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  return handleResponse(response);
};

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    return authenticatedFetch('/auth/me');
  },
};

// Leave APIs
export const leaveAPI = {
  // Get leave types
  getLeaveTypes: async () => {
    return authenticatedFetch('/leaves/types');
  },

  // Submit leave request
  submitRequest: async (requestData) => {
    return authenticatedFetch('/leaves', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Get user's leave requests
  getMyRequests: async () => {
    return authenticatedFetch('/leaves/my-requests');
  },

  // Get user's leave balance
  getMyBalance: async () => {
    return authenticatedFetch('/leaves/balance');
  },

  // Get team requests (Manager)
  getTeamRequests: async (status = null) => {
    const url = status
      ? `/leaves/team-requests?status=${status}`
      : '/leaves/team-requests';
    return authenticatedFetch(url);
  },

  // Approve leave request (Manager)
  approveRequest: async (requestId) => {
    return authenticatedFetch(`/leaves/${requestId}/approve`, {
      method: 'PUT',
    });
  },

  // Reject leave request (Manager)
  rejectRequest: async (requestId, rejectionReason) => {
    return authenticatedFetch(`/leaves/${requestId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejection_reason: rejectionReason }),
    });
  },

  // Get all requests (Admin)
  getAllRequests: async () => {
    return authenticatedFetch('/leaves/all');
  },
};

// Admin APIs
export const adminAPI = {
  // Get all users
  getAllUsers: async () => {
    return authenticatedFetch('/admin/users');
  },

  // Create staff account
  createStaffAccount: async (userData) => {
    return authenticatedFetch('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    return authenticatedFetch(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  // Get user leave balance
  getUserBalance: async (userId) => {
    return authenticatedFetch(`/admin/users/${userId}/balance`);
  },

  // Update leave balance
  updateLeaveBalance: async (userId, leaveTypeId, balanceData) => {
    return authenticatedFetch(`/admin/users/${userId}/balance`, {
      method: 'PUT',
      body: JSON.stringify({ leave_type_id: leaveTypeId, ...balanceData }),
    });
  },

  // Get statistics
  getStatistics: async () => {
    return authenticatedFetch('/admin/statistics');
  },
};

export default {
  auth: authAPI,
  leave: leaveAPI,
  admin: adminAPI,
};
