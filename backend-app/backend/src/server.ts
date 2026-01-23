import http from "http";
import app from "./app";
import {env} from "./config/env";
import {connectDB} from "./config/db";
import { initSocket } from "./socket/index";
connectDB();
const server =http.createServer(app);
initSocket(server);
server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
