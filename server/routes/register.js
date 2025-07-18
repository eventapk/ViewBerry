const express = require('express');
const router = express.Router();
const { db, auth } = require('../firebase');
const { validateUserData, validatePassword } = require('../utils/validation');

// Register route
router.post('/', async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      phone, address, country, state, city,
      category, institution
    } = req.body;

    if (!firstName || !lastName || !email || !password || !institution) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check or create institution
    const institutionSnap = await db.collection('institutions')
      .where('name', '==', institution.trim())
      .limit(1)
      .get();

    let institutionId;
    if (!institutionSnap.empty) {
      institutionId = institutionSnap.docs[0].id;
    } else {
      const newInstitutionRef = await db.collection('institutions').add({
        name: institution.trim(),
        createdAt: new Date().toISOString()
      });
      institutionId = newInstitutionRef.id;
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Save user in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      phone: phone || '',
      address: address || '',
      country: country || '',
      state: state || '',
      city: city || '',
      category: category || '',
      institutionId,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: '✅ User registered successfully' });

  } catch (error) {
    console.error('❌ Registration failed:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
