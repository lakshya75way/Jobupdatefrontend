# Job Scheduler - Backend

Robust Node.js API for managing background jobs and file processing.

## Features

- **Queue Management:** Priority-based in-memory task queue.
- **Asynchronous Processing:** Simulated job execution with retry logic.
- **File Services:** Secure upload, download, and streaming.
- **Push Notifications:** OS-level alerts via Web-Push.
- **WebSocket:** Real-time event broadcasting.

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with MongoDB and SMTP details.

3. **Run Server**
   ```bash
   npm run dev
   ```

## Core Endpoints

- `POST /api/auth/*`: Authentication and push management.
- `GET/POST /api/jobs/*`: Job submission and monitoring.
- `GET/POST /api/uploads/*`: File management and streaming.
