# Job Scheduler - Frontend

Modern React dashboard for monitoring background jobs and managing file uploads.

## Features

- **Real-time Monitoring:** WebSocket-powered updates for task progress.
- **Advanced Uploads:** Multi-file background uploads with a sticky progress tray.
- **Dynamic Search:** Async file searching and instant preview.
- **Security:** Protected routes and session management.

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   VITE_VAPID_PUBLIC_KEY=your_public_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Architecture

- `/src/components`: Generic UI components.
- `/src/hooks`: Business logic and data fetching.
- `/src/pages`: Feature-specific views.
- `/src/store`: Centralized state management (Redux).
