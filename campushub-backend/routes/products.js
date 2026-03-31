const express = require('express');
const multer  = require('multer');
const path    = require('path');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');
const router  = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET — public, anyone can view
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — vendor or admin only
router.post(
  '/',
  requireAuth,
  requireRole(['vendor', 'admin']),
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, price, unit, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const product  = await Product.create({ name, price, unit, category, imageUrl });
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE — vendor or admin only
router.delete(
  '/:id',
  requireAuth,
  requireRole(['vendor', 'admin']),
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;