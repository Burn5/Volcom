const express = require('express');
const Registration = require('../models/Registration');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/registrations
router.post('/', requireAuth, async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;           // 👈 get role from token
  const { opportunityKey, title, organization, date, location } = req.body;

  try {
    // 🚫 BLOCK organizations right here
    if (userRole !== 'Volunteer') {
      return res
        .status(403)
        .json({ message: 'Only volunteers can register for opportunities.' });
    }

    const existing = await Registration.findOne({ user: userId, opportunityKey });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Already registered for this opportunity.' });
    }

    const reg = await Registration.create({
      user: userId,
      userRole,          // 👈 save role into MongoDB
      opportunityKey,
      title,
      organization,
      date,
      location
    });

    res.status(201).json(reg);
  } catch (err) {
    console.error('Registration create error:', err);
    res.status(500).json({ message: 'Registration error' });
  }
});

// GET /api/registrations/my
router.get('/my', requireAuth, async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.userId }).sort({
      createdAt: -1
    });
    res.json(regs);
  } catch (err) {
    console.error('Registration load error:', err);
    res.status(500).json({ message: 'Could not load registrations' });
  }
});

module.exports = router;
