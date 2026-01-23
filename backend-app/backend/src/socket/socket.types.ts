import { Job } from "../modules/jobs/job.types";
export interface ClienttoServerEvents {
  joinRoom: (roomId: string) => void;
  sendMessage: (data: { roomId: string; message: string }) => void;
}
export interface ServerToClientsEvents {
  receiveMessage: (data: { socketId: string; message: string }) => void;
  jobUpdated: (job: Job) => void;
}
export interface SocketData {
  userId?: string;
}
