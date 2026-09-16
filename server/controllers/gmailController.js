const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { oauth2Client, SCOPES } = require('../config/googleAuth');
const { fetchEmails } = require('../services/gmailService');
const { scanEmailsForSpam } = require('../services/spamCheckService');
const { summariseEmail: geminiSummarise } = require('../services/geminiService');
const User = require('../models/User');

function createAuthClient(tokens) {
  const client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
  );
  client.setCredentials(tokens);
  return client;
}

exports.googleAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'select_account',
  });
  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  const base = (process.env.FRONTEND_URI || '').replace(/\/home$/, '').replace(/\/$/, '');

  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    const tempClient = createAuthClient(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: tempClient });
    const { data } = await oauth2.userinfo.get();

    await User.findOneAndUpdate(
      { email: data.email },
      {
        $set: {
          googleId: data.id,
          fullName: data.name,
          email: data.email,
          picture: data.picture,
          locale: data.locale,
          lastLoginAt: new Date(),
        },
        $inc: { loginCount: 1 },
      },
      { upsert: true, new: true },
    );

    const jwtToken = jwt.sign(
      {
        tokens,
        user: { name: data.name, email: data.email, picture: data.picture },
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.redirect(`${base}/?token=${jwtToken}`);
  } catch (err) {
    console.error('Callback error:', err.message);
    res.redirect(`${base}/home`);
  }
};

exports.getEmails = async (req, res) => {
  try {
    const authClient = createAuthClient(req.user.tokens);
    const emails = await fetchEmails(authClient);
    res.json(emails);
  } catch (err) {
    console.error('Get emails error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.scanEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!Array.isArray(emails)) {
      return res.status(400).json({ error: 'emails array required' });
    }
    const results = await scanEmailsForSpam(emails);
    res.json(results);
  } catch (err) {
    console.error('Scan error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.authStatus = (req, res) => res.json({ authenticated: true });

exports.authMe = (req, res) => res.json(req.user.user);

exports.logout = (req, res) => res.json({ success: true });

exports.deleteAccount = async (req, res) => {
  try {
    const email = req.user?.user?.email;
    if (!email) return res.status(400).json({ error: 'Unable to identify user' });
    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) return res.status(404).json({ error: 'Account not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

exports.summariseEmail = async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'AI summariser not configured' });
  }
  try {
    const { subject, from, date, body, bodyType } = req.body;
    if (!body) return res.status(400).json({ error: 'Email body is required' });
    const summary = await geminiSummarise({ subject, from, date, body, bodyType });
    res.json({ summary });
  } catch (err) {
    console.error('Summarise error:', err.message);
    if (err.isRateLimit) return res.status(429).json({ error: 'quota_exceeded' });
    res.status(500).json({ error: err.message || 'Failed to summarise email' });
  }
};
