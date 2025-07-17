const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env
require('dotenv').config();

// Validate required env vars
if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Error: FIREBASE_SERVICE_ACCOUNT, EMAIL_USER, and EMAIL_PASS must be set");
    process.exit(1);
}

// Resolve the absolute path to the service account JSON file
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);

let serviceAccount;
try {
    // Read and parse the service account JSON file
    const rawData = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(rawData);

    // Fix escaped newlines in private key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
} catch (error) {
    console.error("Error loading service account file:", error.message);
    console.error("Make sure the file exists at:", serviceAccountPath);
    console.error("And contains valid JSON");
    process.exit(1);
}

// Initialize Firebase Admin with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://virtual-360-449a8.firebaseio.com"  // Replace with your Firebase DB URL
});

// Get Firestore and Auth instances
const db = admin.firestore();
const auth = admin.auth();

// Export for other modules to use
module.exports = { db, auth };
