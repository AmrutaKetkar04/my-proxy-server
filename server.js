// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable the express server to read JSON bodies

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined in .env file');
}

// Define the proxy endpoint
app.post('/', async (req, res) => {
  try {
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
    
    // Forward the request body from the client to the Google API
    const response = await axios.post(googleApiUrl, req.body);
    
    // Send the response from the Google API back to the client
    res.json(response.data);

  } catch (error) {
    console.error('Error proxying to Google API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to proxy request to Google API' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});