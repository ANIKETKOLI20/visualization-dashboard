import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectMongoDB from './db/connectMongoDB.js';
import Insight from './models/insights.model.js'; 

// Load environment variables from .env file
dotenv.config();

// Initialize express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for CORS and CSP headers
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
  next();
});

// Route to test server status
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to fetch insights data from MongoDB
app.get('/insights', async (req, res) => {
  try {
    console.log('Fetching insights...');
    const insights = await Insight.find({}); 
    res.json(insights); 
  } catch (error) {
    console.error('Error fetching insights:', error.message);
    res.status(500).json({ message: error.message }); 
  }
});

// Start server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB(); // Connect to MongoDB on server start
});
