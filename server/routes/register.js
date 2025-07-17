const express = require('express');
const router = express.Router();
const { db, auth } = require('../firebase');

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      phone, address, country, state, city, category,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

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
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (error) {
    console.error('❌ Registration failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Failed to fetch users:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
