import { DataTypes } from "sequelize";
import sequelize from "../util/database";
import Conversation from "./conversations";
import User from "./users";

const Message = sequelize.define("Message", {
    // id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // conversationId: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    //     references: { model: Conversation, key: "id" },
    // },
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Conversation, key: "id" },
    },
    senderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: "id" },
    },
    // senderId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: "id" } },
    // receiverId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: "id" } },
    content: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Message;
