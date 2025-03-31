import { Server } from "socket.io";

let io: Server | undefined;

export const socketIO = {
    init: (httpServer: any): Server => {
        io = new Server(httpServer, {
            cors: {
                origin: process.env.URL,
                methods: ["GET", "POST"],
            },
        });
        return io;
    },
    getIo: (): Server => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
};
