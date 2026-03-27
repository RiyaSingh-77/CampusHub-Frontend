const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const Listing  = require('../models/Listing');

// GET /api/listings  (public)
router.get('/', async (req, res) => {
  try {
    const query = { status: 'active' };
    if (req.query.category) query.category = req.query.category;
    if (req.query.type)     query.type     = req.query.type;
    if (req.query.search)   query.title    = { $regex: req.query.search, $options: 'i' };

    const listings = await Listing.find(query)
      .populate('seller', 'name phone branch year')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, seller: req.user.id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;