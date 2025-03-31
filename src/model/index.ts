import Conversation from "./conversations";
import Message from "./messages";
import User from "./users";

const relationships = () => {
    User.hasMany(Message, { foreignKey: "senderId" });
    User.hasMany(Message, { foreignKey: "receiverId" });
    Conversation.hasMany(Message, { foreignKey: "conversationId" });
    Message.belongsTo(User, { foreignKey: "senderId" });
    Message.belongsTo(User, { foreignKey: "receiverId" });
};

export default relationships;
