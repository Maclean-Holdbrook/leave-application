# Life Hospital - Leave Management System

A comprehensive leave management system for Life Hospital staff members to apply for and manage leave requests.

## Project Structure

This is the **Frontend** React application. The backend API is in a separate repository:

- **Frontend Repository:** [Maclean-Holdbrook/leave-application](https://github.com/Maclean-Holdbrook/leave-application)
- **Backend Repository:** [Maclean-Holdbrook/leave-application-backend](https://github.com/Maclean-Holdbrook/leave-application-backend)

## Features

### For Employees
- Submit leave requests with date selection and reason
- View leave balance for different leave types
- Track leave request history (pending/approved/rejected)
- View status of all submitted requests
- Real-time balance updates

### For Managers
- View and manage team leave requests
- Approve or reject leave requests with reasons
- View team calendar for coverage planning
- Track approval statistics
- Monitor pending requests requiring action

### For Administrators
- Manage leave policies and allocations
- Set and update leave balances for employees
- View company-wide leave statistics and reports
- Monitor system-wide leave trends
- Access comprehensive analytics

## Tech Stack

### Frontend
- **React 19.1** - UI framework
- **React Router** - Client-side routing
- **Context API** - State management
- **date-fns** - Date manipulation
- **Lucide React** - Icons
- **Vite** - Build tool
- **Custom CSS** - Styling with CSS variables

### Backend
- **Node.js & Express** - Server framework
- **PostgreSQL (Neon)** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5176`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd ../life-hospital-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Neon database URL and JWT secret

5. Set up the database:
   - Run the SQL schema from `src/config/database.sql` in your Neon console

6. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Demo Accounts

- **Employee**: john.doe@lifehospital.com / password123
- **Manager**: michael.brown@lifehospital.com / password123
- **Admin**: sarah.johnson@lifehospital.com / password123

## Leave Types

- **Annual Leave**: 21 days/year
- **Sick Leave**: 10 days/year
- **Maternity Leave**: 90 days
- **Paternity Leave**: 10 days
- **Compassionate Leave**: 5 days

## License

Proprietary - Life Hospital � 2025
