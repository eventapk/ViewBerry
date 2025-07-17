const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const redis = require('redis');

const fs = require('fs');
const { db, auth } = require('./firebase');

const registerRoutes = require('./routes/register');

// ==== CONFIGURATION ====
const GMAIL_USER = 'dummyapk9.com';            // your gmail
const GMAIL_PASS = '123Qwe!@#';              // gmail app password (not your regular one)
const FRONTEND_URL = 'http://localhost:3000';        // your frontend url
const REDIS_URL = 'redis://localhost:6379';          // redis url
const PORT = 5000;

// ==== REDIS SETUP ====
const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.connect().catch(console.error);

// ==== EMAIL TRANSPORTER ====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// ==== EXPRESS SETUP ====
const app = express();

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));
app.use(helmet());

// ==== RATE LIMITING ====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ==== HELPER FUNCTION: Send OTP email ====
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"NoReply" <noreply@yourdomain.com>`, // fake noreply sender
    to: email,
    subject: 'Your OTP Code for Password Reset',
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code is valid for 10 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Email send failed');
  }
};

// ==== OTP ROUTES ====

// Send OTP
app.post('/send-otp', [body('email').isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await redisClient.setEx(`otp:${email}`, 600, otp); // store OTP for 10 minutes
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and Reset Password
app.post('/verify-otp', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, otp, newPassword } = req.body;

  try {
    const savedOtp = await redisClient.get(`otp:${email}`);
    if (savedOtp !== otp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password: newPassword });
    await redisClient.del(`otp:${email}`);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// ==== ROUTES ====
app.use('/api', registerRoutes);

// ==== START SERVER ====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
