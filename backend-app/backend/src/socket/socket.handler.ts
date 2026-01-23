import {Socket} from "socket.io";
import {
    ClienttoServerEvents,
    ServerToClientsEvents,
    SocketData
} from "./socket.types";
export const registerSocketHandlers =(
    socket :Socket<ClienttoServerEvents,ServerToClientsEvents,{},SocketData> ):void =>{
        console.log("socket connected ",socket.id);
        socket.on("joinRoom",(roomId)=>{
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`)
        });
        socket.on("sendMessage",({roomId,message})=>{
            socket.to(roomId).emit("receiveMessage",{
                socketId:socket.id,
            message});
        });
        socket.on("disconnect",()=>{
            console.log("Socket disconnected success" , socket.id);
        });
    };
