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
        const { userId } = req.body;

        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
        });

        const data = await Promise.all(
            users.map(async (user) => {
                const formattedUser = user.get({ plain: true });

                const conversation = await Conversation.findOne({
                    where: {
                        [Op.or]: [
                            { user1Id: userId, user2Id: formattedUser.id },
                            { user1Id: formattedUser.id, user2Id: userId },
                        ],
                    },
                });
                const formattedConversation = conversation
                    ? conversation.get({ plain: true })
                    : null;

                if (formattedConversation) {
                    const message = await Message.findOne({
                        order: [["createdAt", "DESC"]],
                        where: {
                            conversationId: formattedConversation.id,
                        },
                    });

                    return {
                        ...formattedUser,
                        lastSentMessage: message,
                    };
                } else {
                    return {
                        ...formattedUser,
                        lastSentMessage: {},
                    };
                }
            })
        );

        res.status(200).json(data);
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
        const { user1Id, user2Id } = req.body;

        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                ],
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({ user1Id, user2Id });
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

        const senderSocketId = users.get(senderId);
        const receiverSocketId = users.get(receiverId);

        if (senderSocketId && senderId != receiverId) {
            io.getIo().to(senderSocketId).emit("receive-message", message);
        } else {
            console.log(`User ${receiverId} is not online.`);
        }

        if (receiverSocketId) {
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
