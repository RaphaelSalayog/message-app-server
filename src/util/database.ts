import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false, // Disable logging SQL queries (optional)
    }
);

export const connectDB = async (callback: () => void) => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to PostgreSQL successfully!");
        await syncDB();
        await callback();
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
};

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database & tables synced!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
};

export default sequelize;
