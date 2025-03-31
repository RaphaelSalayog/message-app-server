import express from "express";
import {
    getAllUsers,
    getMessagesByConversation,
    createConversation,
    sendMessage,
} from "../controller/chat";
import isAuth from "../middleware/auth";

const chatRouter = express.Router();

chatRouter.get("/users/getAllUsers", isAuth, getAllUsers);
chatRouter.post("/conversation/createConversation", isAuth, createConversation);
chatRouter.post("/conversation/getMessagesByConversation", isAuth, getMessagesByConversation);
chatRouter.post("/message/sendMessage", isAuth, sendMessage);

export default chatRouter;
