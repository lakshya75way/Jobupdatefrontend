import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket.handler";
import {
  ClienttoServerEvents,
  ServerToClientsEvents,
  SocketData,
} from "./socket.types";
export let io: Server<
  ClienttoServerEvents,
  ServerToClientsEvents,
  {},
  SocketData
>;
export const initSocket = (httpServer: HttpServer) => {
  io = new Server<ClienttoServerEvents, ServerToClientsEvents, {}, SocketData>(
    httpServer,
    {
      cors: {
        origin: "*",
      },
    }
  );
  io.on("connection", (socket) => {
    registerSocketHandlers(socket);
  });
  return io;
};
