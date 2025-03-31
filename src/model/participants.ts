import { DataTypes } from "sequelize";
import sequelize from "../util/database";
import User from "./users";
import Conversation from "./conversations";

const Participant = sequelize.define("Participant", {
    // id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    // userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: "id" } },
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Conversation, key: "id" },
    },
});

export default Participant;
