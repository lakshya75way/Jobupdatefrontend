# Task- Simulate async background processing without external services.

A streamlined system for user authentication and background job management.

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript, MongoDB, Socket.io
- **Frontend:** React, TypeScript, Vite, Socket.io-client

## 🔑 Key Features

- User authentication (Signup, Login, Password Reset)
- Multi-tenant Background Jobs (Users only see their own jobs)
- Priority-based Queue (Higher priority numbers process first; defaults to 0)
- User can add any metadata with the body (from postman). Frontend supports `priority`, `shouldFail` (Permanent), and `failOnce` (Temporary failure) for testing.
- Admin Role (Can view all user jobs via `/admin/all`)
- Real-time Communication via Socket.io (Separate module)
- Real-time Polling on Dashboard for job progress monitoring
- **OS-Level Push Notifications:** Background notifications for file uploads and system alerts using web-push.

## 📂 Environment Variables (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_db
JWT_SECRET=supersecretkey
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

## 🛣 API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/verify/:token` (Check terminal for link)
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset/:token`
- `POST /api/auth/change-password` (Auth required)
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `POST /api/auth/push-subscription` (Manage background alerts)
- `POST /api/auth/schedule-test-notification` (Test background push)
- `DELETE /api/auth/push-subscription` (Remove alerts)

### Jobs

- `POST /api/jobs/submit` - Create a background task.
  _(Fields: `type`, `data` (any JSON), `priority` (Number, default: 0))_
- `GET /api/jobs/all` - List your jobs
- `GET /api/jobs/:id` - Get specific job status
- `GET /api/jobs/admin/all` - **Admin Only** view for all system jobs

### Uploads

- `POST /api/uploads/upload` - Single or Bulk file upload (supports background tracking)
- `GET /api/uploads/my-files` - List your uploaded files with search support
- `GET /api/uploads/view/:id` - Stream file directly to browser for preview
- `GET /api/uploads/download/:id` - Download physical file
- `DELETE /api/uploads/:id` - Delete file and DB record

**System Features:**

- **Self-Healing Sync:** The system automatically keeps the database in sync with actual files on disk. If a file is missing, the record is cleaned up automatically.
- **Reliable Architecture:** Designed to be stable and easy to maintain.
- **Multi-tenant Storage:** Users can only access and manage their own files.

### Socket Events (WebSocket)

- `joinRoom` - Join a specific room.
- `sendMessage` - Send a message to a room.
- `receiveMessage` - Listen for messages.

## 🧪 Testing Points

1. **User Isolation:** Register two accounts. Jobs created in Account A won't show up in Account B's dashboard.
2. **Admin Access:** Manually set `role: "admin"` in MongoDB for a user. That user can now access the Admin route to see everyone's jobs.
3. **Retry Logic:** Use "Fail Once" (Temporary) to see a successful retry, or "Permanent Failure" to see the job fail after exhausting retries.
4. **Natural Failure:** Even without checkboxes, there is a **5% random chance** of a "System Fluctuation Error" to simulate real-world instability.
5. **Priority Check:** Submit 3 standard jobs (priority 0) followed by 1 high-priority job (priority 10). Observe that the priority 10 job jumps to the head of the pending queue.

## 🚀 Setup

1. `npm install` in both `backend` and `frontend` folders.
2. Setup `.env` in the backend.
3. Run `npm run dev` in both.
