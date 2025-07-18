const express = require('express');
const router = express.Router();
const admin = require('../firebase-admin-setup');
const enhancedAuth = require('../middleware/enhancedAuth');
const { validateUserData } = require('../utils/validation');
const { db } = require('../firebase');

// Get current user profile
router.get('/users', enhancedAuth, async (req, res) => {
  try {
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userData = userDoc.data();
    delete userData.password;

    res.json({
      ...userData,
      firebaseUser: {
        uid: req.user.uid,
        email: req.user.email,
        emailVerified: req.user.email_verified
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update profile
router.put('/profile', enhancedAuth, async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    validateUserData({ email: req.user.email, ...updateData });

    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete account
router.delete('/account', enhancedAuth, async (req, res) => {
  try {
    await admin.firestore().collection('users').doc(req.user.uid).delete();
    await admin.auth().deleteUser(req.user.uid);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Admin: Get all users
router.get('/users/all', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    const users = await Promise.all(snapshot.docs.map(async (doc) => {
      const user = { id: doc.id, ...doc.data() };

      if (user.institutionId) {
        try {
          const instDoc = await db.collection('institutions').doc(user.institutionId).get();
          user.institutionName = instDoc.exists ? instDoc.data().name : 'Unknown';
        } catch {
          user.institutionName = 'Unknown';
        }
      } else {
        user.institutionName = 'N/A';
      }

      return user;
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Failed to fetch users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific user by ID
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
