const express = require('express');
const router  = express.Router();
const Event   = require('../models/Event');

// ─────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────

// GET /api/events  →  all approved events (shown on /events page)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).sort({ dateStart: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events  →  society submits a new event (status: pending)
router.post('/', async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, status: 'pending' });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────

// GET /api/events/admin/all  →  all submissions regardless of status
router.get('/admin/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/events/admin/:id  →  approve or reject
router.patch('/admin/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/admin/:id  →  permanently delete
router.delete('/admin/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;