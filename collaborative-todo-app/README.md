# Collaborative Todo App

A production-ready, offline-first collaborative task management application.

## 🚀 Features

Create/manage multiple project boards (beyond single-board limit).
Email-based invites with **Owner/Editor** role permissions.
todo can add any metadata and description
in collab we can see status of collaborators
can see all collaborators
Includes Email Verification, Password Reset, and Refresh Token rotation.
Full functionality without internet (IndexedDB); auto-syncs when online.
Instant updates via WebSockets with conflict resolution.
Drag-and-drop reordering, optimistic updates, and glassmorphism design.

## 🛠 Usage

1. **Install Dependencies**

   ```bash
   npm run install:all
   ```

2. **Environment Setup**
   Create a `.env` file in the `backend/` directory:

   ```env
   # General Configuration
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   FRONTEND_URL=http://localhost:5173

   # Database
   MONGODB_URI=mongodb://localhost:27017/collaborative-todo

   # Security
   JWT_SECRET=super_secret_key_change_me
   JWT_EXPIRES_IN=24h

   # Email (SMTP)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   # MAIL_FROM=  (Optional: defaults to MAIL_USER)
   ```

3. **Run Application**
   ```bash
   npm run dev
   ```
   Starts Backend (Port 5000) and Frontend (Port 5173).

## � API Endpoints

**Base URL**: `http://localhost:5000/api`

### Auth

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh-token` - Rotate access tokens
- `POST /auth/logout` - Clear auth cookies

### Boards

- `GET /boards` - List user's boards
- `POST /boards` - Create a new board
- `GET /boards/:id` - Get board details
- `POST /boards/:id/invite` - Invite collaborator
- `POST /boards/:id/accept` - Accept invitation

### Todos (Hybrid REST + Sockets)

- `GET /todos?boardId=:id` - Fetch all todos for a board
- `DELETE /todos/:id` - Delete a todo
- `PATCH /todos/:id/move` - Update todo order
- **Create/Update**: Handled via WebSocket event `sync-todo` for real-time performance.

## 🧪 Testing

### Manual Browser Testing

1. **Real-time**: Open two different browsers (e.g., Chrome & Firefox). Log in as two different users. Invite one user to the other's board. Changes should appear instantly.
2. **Offline Mode**:
   - Open DevTools -> Network -> **Offline**.
   - Create/Edit tasks.
   - Switch back to **Online**.
   - Verify tasks sync to the server.

### Postman / API Testing

- Import the provided Postman Collection (if available) or use the endpoints above.
- **Note**: For protected routes, ensure the `Authorization: Bearer <token>` header is set.

## 📂 Architecture

- **Backend**: Modular MVC with `Express`, `Zod` Validation, and `Mongoose`.
- **Frontend**: `React 18`, `Vite`, `Dexie` (IndexedDB), and Custom Hooks.
- **Real-time**: `Socket.io` with dedicated namespaces and room-based isolation.
