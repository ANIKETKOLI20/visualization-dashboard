// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Define the port number, defaulting to 5000 if not provided
const PORT = process.env.PORT || 5000;

// Define a route for the root endpoint
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
