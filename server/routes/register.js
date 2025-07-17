const express = require('express');
const router = express.Router();
const { db, auth } = require('../firebase');

router.post('/register', async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      phone, address, country, state, city,
      category, institution
    } = req.body;

    if (!firstName || !lastName || !email || !password || !institution) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if institution exists
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
      institutionId: institutionId,
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

    const users = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const user = { id: doc.id, ...doc.data() };

        // Fetch institution name using institutionId
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
      })
    );

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
