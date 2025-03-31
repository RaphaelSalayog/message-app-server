import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import relationships from "./model";
import { Request, Response, NextFunction } from "express";
import { connectDB } from "./util/database";
import { socketIO } from "./socket";

dotenv.config();

export const users = new Map<number, string>();

const app = express();
app.use(
    cors({
        origin: process.env.URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
    express.json()
);

relationships();
app.use(authRouter);
app.use(chatRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "An unexpected error occurred";

    res.status(status).json({ message, status });
});

connectDB(() => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    const io = socketIO.init(server);
    io.on("connection", (socket: any) => {
        console.log("Client connected");

        socket.on("register", (userId: number) => {
            users.set(+userId, socket.id);
        });

        socket.on(
            "typing",
            ({
                senderId,
                receiverId,
                isTyping,
            }: {
                senderId: string;
                receiverId: string;
                isTyping: boolean;
            }) => {
                const receiverSocketId = users.get(+receiverId);
                if (receiverSocketId) {
                    socket.to(receiverSocketId).emit("is-typing", {
                        senderId,
                        receiverId,
                        isTyping,
                    });
                }
            }
        );

        socket.on("disconnect", () => {
            users.forEach((value, key) => {
                if (value === socket.id) {
                    users.delete(key);
                    console.log(`User ${key} disconnected`);
                }
            });
        });
    });
});
