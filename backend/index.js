// const express = require('express');

// const app = express();

// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Welcome to FitComp!');
// });

// app.get('/health', (req, res) => {
//   res.json({ status: 'Healthy' });
// });

// app.listen(port, () => {
//   console.log(`FitComp app listening on port ${port}`);
// });

// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get("/", (_, res) => res.send("Welcome to FitComp!"));
app.use("/api", require("./routes/api"));

// DB & server start
connectDB().then(() =>
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
);
