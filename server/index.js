
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('./firebase-admin-setup');
const enhancedAuth = require('./middleware/enhancedAuth');
const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter, registrationLimiter } = require('./middleware/rateLimiter');
 
// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const registerRoute = require('./routes/register');
const dashboardRoute = require('./routes/DirectorDashboard');
// const adminRoutes = require('./routes/adminpanel');
 
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
 
// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', usersRoutes);
app.use('/api/register', registerRoute);
app.use('/api/dashboard', dashboardRoute);
// app.use('/api/admin', adminRoutes);
 
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
 