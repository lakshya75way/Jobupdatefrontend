# Job Scheduler - Frontend

React + TypeScript frontend for the Job Scheduler application.

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit (state management)
- Ant Design (UI components)
- Socket.IO Client (real-time updates)
- Axios (HTTP client)
- Vite (build tool)
- React Router v7
- Yup (validation)

## Setup

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=your_public_vapid_key
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Build

```bash
npm run build
```

## Features

- User authentication (login, signup, email verification)
- Real-time job monitoring with WebSocket
- Job submission with priority levels
- Job status tracking (pending, processing, completed, failed)
- Retry mechanism visualization
- Admin dashboard for all jobs
- Password reset functionality
- **Persistent Push Notifications:** Stay updated even when the tab is closed with OS-level alerts.
- Responsive design

## File Management System

- **Advanced Upload Tray:** Sticky "Google Drive" style tray for monitoring background uploads in real-time.
- **Quick Upload Dashboard:** Homepage integration with drag-and-drop for instant file processing.
- **Async Search Picker:** `react-select` powered search bar with instant file preview and opening.
- **File Management:** A dedicated page to manage your uploads. You can search, filter, download, or delete files easily.
- **Reliable Backend:** Built with a focus on stability and performance for handling multiple users.

## Project Structure

```
src/
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── layouts/        # Layout components (Guest, Authenticated)
├── pages/          # Page components
├── router/         # React Router configuration
├── services/       # API and Socket services
├── store/          # Redux store and slices
├── types/          # TypeScript type definitions
├── validations/    # Yup validation schemas
└── variables.css   # CSS variables
```

## Key Files

- `src/services/api.ts` - Axios instance with interceptors
- `src/services/socket.ts` - Socket.IO client setup
- `src/store/slices/authSlice.ts` - Authentication state
- `src/hooks/useJobs.ts` - Job management hook
- `src/validations/schemas.ts` - Form validation schemas

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
