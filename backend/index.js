// index.js

// Import the express module
const express = require('express');

// Create an instance of an Express app
const app = express();

// Define the port the server will listen on.
// This uses an environment variable if available, or defaults to 3000.
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to FitComp!');
});

// You can add more routes as needed.
// For example, a simple health check route:
app.get('/health', (req, res) => {
  res.json({ status: 'Healthy' });
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`FitComp app listening on port ${port}`);
});
