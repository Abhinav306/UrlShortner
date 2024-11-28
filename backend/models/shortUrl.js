// models/shortUrl.js
import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the model using the schema
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

// Export the model as default
export default ShortUrl;
