const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const gmailRoutes = require('./routes/gmailRoutes');

const app = express();

connectDB();

const allowedOrigin = (process.env.FRONTEND_URI || 'http://localhost:5173')
  .replace(/\/home$/, '')
  .replace(/\/$/, '');

app.use(helmet());
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '512kb' }));

const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded. Please wait a minute.' },
});

app.use('/', baseLimiter);
app.use('/chat', aiLimiter);
app.use('/emails/summarise', aiLimiter);

app.use('/', gmailRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
