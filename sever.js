const express = require('express');
const cors = require('cors');
const db = require('./firebase-config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://yourusername.github.io'], // add your GitHub Pages URL later
  methods: ['GET', 'POST']
}));
app.use(express.json());

// ======================
// CONTACT FORM ENDPOINT
// ======================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const docRef = await db.collection('contacts').add({
      name,
      email,
      message,
      timestamp: new Date(),
      status: 'new'
    });

    console.log(`✅ New contact saved with ID: ${docRef.id}`);
    res.status(201).json({ 
      success: true, 
      message: 'Thank you! Your message has been saved 🐾',
      id: docRef.id 
    });
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Optional: Get all contacts (for admin dashboard later)
app.get('/api/contacts', async (req, res) => {
  try {
    const snapshot = await db.collection('contacts').orderBy('timestamp', 'desc').get();
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PawCare Backend running on http://localhost:${PORT}`);
});
