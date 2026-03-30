const LostFound = require('../models/LostFound');

// GET all items (with optional filters)
exports.getAllItems = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const query = {};

    if (type && type !== 'all') query.type = type;
    if (category && category !== 'All Categories') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const items = await LostFound.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create new item
exports.createItem = async (req, res) => {
  try {
    const item = await LostFound.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE item by id
exports.deleteItem = async (req, res) => {
  try {
    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH mark as resolved
exports.resolveItem = async (req, res) => {
  try {
    const item = await LostFound.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};