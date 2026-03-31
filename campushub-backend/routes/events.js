const express = require('express');
const router  = express.Router();
const Event   = require('../models/Event');
const { requireAuth, requireAdmin, requireRole } = require('../middleware/auth');

// ─────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────

// GET /api/events  →  all approved events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).sort({ dateStart: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events  →  anyone can submit (status: pending)
router.post('/', async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, status: 'pending' });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─────────────────────────────────────────
// ADMIN — JWT protected, role: 'admin' only
// ─────────────────────────────────────────

// GET /api/events/admin/all
router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/events/admin/:id  →  approve / reject / revert to pending
router.patch('/admin/:id', requireAuth, requireAdmin, async (req, res) => {
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

// DELETE /api/events/admin/:id
router.delete('/admin/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;