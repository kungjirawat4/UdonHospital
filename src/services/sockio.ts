import { io } from "socket.io-client";

export const socketClient = io(process.env.SOCKET_IO);