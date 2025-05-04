require('dotenv').config();


const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Use environment variable for MongoDB URI
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/";

        mongoose.set("strictQuery", true); // Recommended setting
        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB disconnected.");
    } catch (error) {
        console.error(`Error disconnecting MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB, disconnectDB };
