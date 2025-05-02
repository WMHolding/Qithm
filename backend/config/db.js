// /home/ubuntu/backend_code/config/db.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectDB = async () => {
    try {
        // Start in-memory MongoDB server for testing
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        mongoose.set("strictQuery", true); // Recommended setting
        const conn = await mongoose.connect(mongoUri, {
            // useNewUrlParser: true, // Deprecated
            // useUnifiedTopology: true, // Deprecated
        });

        console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
            console.log("In-Memory MongoDB stopped.");
        }
    } catch (error) {
        console.error(`Error disconnecting MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB, disconnectDB };
