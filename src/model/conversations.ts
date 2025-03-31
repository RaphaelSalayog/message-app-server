import { DataTypes } from "sequelize";
import sequelize from "../util/database";
import User from "./users";

const Conversation = sequelize.define("Conversation", {
    // id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    senderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: "id" },
    },
    // senderId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: "id" } },
    // receiverId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: "id" } },
});

export default Conversation;
