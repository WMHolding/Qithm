// /home/ubuntu/backend_code/server.js
const express = require("express");
const { connectDB, disconnectDB } = require("./config/db");
const userRoutes = require("./routes/dashboardRoutes/userRoutes");
const challengeRoutes = require("./routes/dashboardRoutes/challengeRoutes");
const challengeEnrollmentRoutes = require("./routes/dashboardRoutes/challengeEnrollmentRoutes");
const progressRoutes = require("./routes/dashboardRoutes/progressRoutes");

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json()); // Allows us to accept JSON data in the body

// Define Routes
app.get("/", (req, res) => res.send("API Running")); // Simple test route

// Mount the specific routers
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/enrollments", challengeEnrollmentRoutes);
app.use("/api/progress", progressRoutes);

// --- Basic Error Handling Middleware ---
// Not Found Handler (404)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// General Error Handler
// Needs to be the last piece of middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Provide stack trace only in development mode (optional)
        // stack: process.env.NODE_ENV === "production" ? null : err.stack,
        stack: err.stack, // Show stack for debugging
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
        disconnectDB().then(() => process.exit(1));
    });
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(async () => {
        console.log("HTTP server closed");
        await disconnectDB();
        process.exit(0);
    });
});

