require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nanoid = require('nanoid').nanoid;
const Url = require('./models/Url');

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// Create short URL
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'Missing URL' });

  const shortId = nanoid(7);
  const newUrl = new Url({ originalUrl, shortId });
  await newUrl.save();

  res.json({ shortUrl: `https://url-shortner-2pf2.onrender.com/${shortId}` });
});

// Redirect
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await Url.findOne({ shortId });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
