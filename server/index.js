const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('./firebase-admin-setup');
const enhancedAuth = require('./middleware/enhancedAuth');
const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter, registrationLimiter } = require('./middleware/rateLimiter');
const { validateUserData, validatePassword } = require('./utils/validation');

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/register', registrationLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', usersRoutes);

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, ...userData } = req.body;

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate user data
    validateUserData({ email, ...userData });

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // Store additional user data in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      ...userData,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null,
      emailVerified: false
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: userRecord.uid
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }

    res.status(400).json({ error: error.message });
  }
});

// Protected route example
app.get('/api/protected', enhancedAuth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.email_verified
    },
    sessionInfo: {
      id: req.session?.id,
      createdAt: req.session?.createdAt,
      lastActivity: req.session?.lastActivity
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    activeSessions: require('./middleware/sessionManager').getActiveSessionsCount()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Session management enabled`);
  console.log(`🔒 Firebase Admin SDK initialized`);
});
