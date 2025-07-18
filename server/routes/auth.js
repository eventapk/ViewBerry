const express = require('express');
const router = express.Router();
const enhancedAuth = require('../middleware/enhancedAuth');
const sessionManager = require('../middleware/sessionManager');

// Session info endpoint
router.get('/session-info', enhancedAuth, (req, res) => {
  res.json({
    session: {
      id: req.session.id,
      user: req.user,
      createdAt: req.session.createdAt,
      lastActivity: req.session.lastActivity
    }
  });
});

// Logout endpoint
router.post('/logout', enhancedAuth, (req, res) => {
  try {
    sessionManager.removeSession(req.session.id);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Refresh session endpoint
router.post('/refresh-session', enhancedAuth, async (req, res) => {
  try {
    const { newToken } = req.body;
    
    if (!newToken) {
      return res.status(400).json({ error: 'New token required' });
    }

    // Verify the new token
    const decodedToken = await admin.auth().verifyIdToken(newToken);
    
    // Update session with new token
    const updatedSession = await sessionManager.refreshSession(req.session.id, newToken);
    
    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ 
      message: 'Session refreshed successfully',
      sessionId: updatedSession.id
    });
  } catch (error) {
    console.error('Session refresh failed:', error);
    res.status(500).json({ error: 'Session refresh failed' });
  }
});

// Get active sessions for admin
router.get('/active-sessions', enhancedAuth, (req, res) => {
  // Only allow admin users (you can implement your own admin check)
  if (req.user.admin) {
    const activeSessionsCount = sessionManager.getActiveSessionsCount();
    res.json({ activeSessionsCount });
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
});

module.exports = router;
