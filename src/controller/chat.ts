import { NextFunction, Request, Response } from "express";
import Conversation from "../model/conversations";
import Message from "../model/messages";
import { Op } from "sequelize";
import { socketIO } from "../socket";
import { users } from "../server";
import User from "../model/users";

const io = socketIO;

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(users);
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

export const createConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({ senderId, receiverId });
        }

        res.status(201).json(conversation);
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

export const sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { senderId, receiverId, conversationId, content } = req.body;
        const message = await Message.create({ senderId, receiverId, conversationId, content });

        const receiverSocketId = users.get(receiverId);

        if (receiverSocketId && senderId != receiverId) {
            // Send message to the specific receiver
            io.getIo().to(receiverSocketId).emit("receive-message", message);
        } else {
            console.log(`User ${receiverId} is not online.`);
        }
        io.getIo();

        res.status(201).json(message);
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

export const getMessagesByConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { conversationId } = req.body;
        const messages = await Message.findAll({
            where: { conversationId },
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json(messages);
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};
