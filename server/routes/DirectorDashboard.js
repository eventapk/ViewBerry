const express = require('express');
const router = express.Router();
const db = require('../firebase-admin-setup'); // This now returns the Firestore db

router.get('/categories', async (req, res) => {
  try {
    console.log('🔍 Fetching categories from Firestore...');
    const snapshot = await db.collection('users').get();

    const categoryCounts = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const category = data.category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    console.log('✅ Category counts:', categoryCounts);
    res.json(categoryCounts);
  } catch (error) {
    console.error('❌ Error in /categories route:', error);
    res.status(500).json({
      error: 'Error fetching user categories',
      details: error.message,
    });
  }
});

module.exports = router;
