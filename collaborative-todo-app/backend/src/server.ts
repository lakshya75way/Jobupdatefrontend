import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { config } from "./config/env.config.js";
import { connectDatabase } from "./config/database.js";
import { setupSocketHandlers } from "./modules/todos/todo.socket.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

setupSocketHandlers(io);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    server.listen(config.port, () => {
      console.log(`[Server] Running on port ${config.port}`);
      console.log(`[Server] Environment: ${config.nodeEnv}`);
      console.log(`[Server] CORS Origin: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error("[Server] Failed to start:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err: Error) => {
  console.error("[Server] UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("[Server] 👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("[Server] 💥 Process terminated!");
  });
});

startServer();
