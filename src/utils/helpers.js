// Helper Functions
import { format, differenceInDays, parseISO, isWeekend } from 'date-fns';

// Format date to display string
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Calculate number of working days between two dates (excluding weekends)
export const calculateWorkingDays = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  let workingDays = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get status badge color class
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected'
  };
  return statusMap[status] || 'badge-info';
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Calculate leave balance remaining
export const calculateRemainingBalance = (totalBalance, usedDays) => {
  return Math.max(0, totalBalance - usedDays);
};

// Check if dates overlap
export const datesOverlap = (start1, end1, start2, end2) => {
  const s1 = typeof start1 === 'string' ? parseISO(start1) : start1;
  const e1 = typeof end1 === 'string' ? parseISO(end1) : end1;
  const s2 = typeof start2 === 'string' ? parseISO(start2) : start2;
  const e2 = typeof end2 === 'string' ? parseISO(end2) : end2;

  return s1 <= e2 && s2 <= e1;
};

// Format leave duration
export const formatLeaveDuration = (startDate, endDate) => {
  const days = calculateWorkingDays(startDate, endDate);
  return `${days} ${days === 1 ? 'day' : 'days'}`;
};
