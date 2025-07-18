const admin = require('firebase-admin');

class SessionManager {
  constructor() {
    this.activeSessions = new Map();
    this.sessionTimeout = 60 * 60 * 1000; // 1 hour
    
    // Clean up expired sessions every 30 minutes
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 30 * 60 * 1000);
  }

  async createSession(token, userInfo) {
    const sessionId = this.generateSessionId();
    const session = {
      id: sessionId,
      token,
      user: userInfo,
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  async validateSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    
    if (!session || !session.isActive) {
      return null;
    }

    // Check if session has expired
    const now = new Date();
    if (now - session.lastActivity > this.sessionTimeout) {
      this.removeSession(sessionId);
      return null;
    }

    // Update last activity
    session.lastActivity = now;
    return session;
  }

  async refreshSession(sessionId, newToken) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.token = newToken;
      session.lastActivity = new Date();
      return session;
    }
    return null;
  }

  removeSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.activeSessions.delete(sessionId);
    }
  }

  cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of this.activeSessions) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.removeSession(sessionId);
      }
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getActiveSessionsCount() {
    return this.activeSessions.size;
  }

  getUserSessions(userId) {
    return Array.from(this.activeSessions.values())
      .filter(session => session.user.uid === userId && session.isActive);
  }
}

module.exports = new SessionManager();
