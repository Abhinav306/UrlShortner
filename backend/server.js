import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import ShortUrl from './models/shortUrl.js';
import cors from 'cors';

const app = express();

// CORS configuration
var corsOptions = {
  origin: 'http://localhost:3000', // Removed the trailing slash
  optionsSuccessStatus: 200,       // For legacy browser support
};

// Apply CORS globally for all routes
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://abhinavsinghal306:<db_password>@urlshort.hws67.mongodb.net/?retryWrites=true&w=majority&appName=UrlShort', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Route to shorten a URL
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body; // Extract the long URL from the request body
  const shortCode = nanoid(8);  // Generate a unique short code using nanoid
  const shortUrl = new ShortUrl({ longUrl, shortCode }); // Create a new ShortUrl document
  await shortUrl.save(); // Save to the database
  res.json({ shortUrl: `http://localhost:3000/${shortCode}` }); // Respond with the shortened URL
});

// Route to handle redirection from the short URL
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params; // Extract the shortCode from the URL parameter
  const shortUrl = await ShortUrl.findOne({ shortCode }); // Find the short URL in the database
  if (shortUrl) {
    res.redirect(shortUrl.longUrl); // Redirect to the original long URL
  } else {
    res.status(404).send('URL not found'); // Handle case where short URL does not exist
  }
});

// Start the server and listen on port 3000
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
