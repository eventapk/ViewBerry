// routes/session.js
const express = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// Set a very long expiration (e.g., 365 days) or remove `expiresIn` for no expiration
const JWT_EXPIRES_IN = "365d";

router.post("/sessionLogin", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const payload = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token });
  } catch (error) {
    console.error("Firebase ID token verification failed:", error);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
});

module.exports = router;
