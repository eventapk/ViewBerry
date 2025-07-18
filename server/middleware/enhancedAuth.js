const admin = require("firebase-admin");
const sessionManager = require('./sessionManager');

const enhancedAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const sessionId = req.headers['x-session-id'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if session exists and is valid
    let session = null;
    if (sessionId) {
      session = await sessionManager.validateSession(sessionId);
    }

    // Create new session if none exists
    if (!session) {
      session = await sessionManager.createSession(idToken, decodedToken);
    }

    // Attach user and session info to request
    req.user = decodedToken;
    req.session = session;
    
    // Send session ID back to client
    res.setHeader('X-Session-ID', session.id);
    
    next();
  } catch (error) {
    console.error("Auth/Session verification failed:", error);
    
    if (sessionId) {
      sessionManager.removeSession(sessionId);
    }
    
    res.status(401).json({ error: "Unauthorized: Invalid token or session" });
  }
};

module.exports = enhancedAuth;
