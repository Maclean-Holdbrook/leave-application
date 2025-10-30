// Application Constants

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

export const LEAVE_TYPES = {
  ANNUAL: 'Annual Leave',
  SICK: 'Sick Leave',
  MATERNITY: 'Maternity Leave',
  PATERNITY: 'Paternity Leave',
  COMPASSIONATE: 'Compassionate Leave',
  UNPAID: 'Unpaid Leave'
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const LEAVE_BALANCES = {
  ANNUAL: 21, // days per year
  SICK: 10,
  MATERNITY: 90,
  PATERNITY: 10,
  COMPASSIONATE: 5,
  UNPAID: 0
};
