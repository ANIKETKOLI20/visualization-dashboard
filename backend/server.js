import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectMongoDB from './db/connectMongoDB.js';
import Insight from './models/insights.model.js'; 

// Load environment variables from .env file
dotenv.config();

// Initialize express application
const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for CORS and CSP headers
app.use(cors({
  origin: 'http://localhost:3000' 
}));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route to test server status
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to fetch insights data from MongoDB
app.get('/insights', async (req, res) => {
  try {
    console.log('Fetching insights...');
    const insights = await Insight.find({});
    console.log('Fetched insights:', insights);
    res.json(insights); 
  } catch (error) {
    console.error('Error fetching insights:', error.message);
    res.status(500).json({ message: error.message }); 
  }
});

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
});

// Start server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
