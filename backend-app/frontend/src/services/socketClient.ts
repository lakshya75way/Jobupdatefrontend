import { io, Socket } from "socket.io-client";
import { env } from "../config/env.config";
import { storageService } from "./storage.service";

class SocketClient {
  private static instance: SocketClient;
  public socket: Socket;

  private constructor() {
    this.socket = io(env.VITE_SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: (cb) => {
        cb({ token: storageService.getAccessToken() });
      },
    });

    this.setupListeners();
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  private setupListeners() {
    this.socket.on("connect", () => {
      if (import.meta.env.DEV) {
        console.log("Socket connected:", this.socket.id);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        this.socket.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
  }

  public connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public refreshAuth() {
    if (this.socket.connected) {
      this.socket.disconnect().connect();
    }
  }
}

export const socketClient = SocketClient.getInstance();
export const socket = socketClient.socket;
