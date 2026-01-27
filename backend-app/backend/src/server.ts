import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initSocket } from "./socket/index";
connectDB();
const server = http.createServer(app);
initSocket(server);

const PORT = env.PORT || process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server version 2.0 running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api/docs`);
});
