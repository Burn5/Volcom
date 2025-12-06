const express = require('express');
const Opportunity = require('../models/Opportunity');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/opportunities  – list all
router.get('/', async (req, res) => {
  try {
    const items = await Opportunity.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/opportunities/:id – get one
router.get('/:id', async (req, res) => {
  try {
    const item = await Opportunity.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('Get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/opportunities – create (only Organization)
router.post('/', requireAuth, async (req, res) => {
  try {
    if (req.userRole !== 'Organization') {
      return res.status(403).json({ message: 'Only organizations can create.' });
    }

    const data = {
      ...req.body,
      createdBy: req.userId
    };

    const item = await Opportunity.create(data);
    res.status(201).json(item);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/opportunities/:id – update (only creator org)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Opportunity.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (String(item.createdBy) !== req.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json(item);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/opportunities/:id – delete (only creator org)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Opportunity.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (String(item.createdBy) !== req.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
