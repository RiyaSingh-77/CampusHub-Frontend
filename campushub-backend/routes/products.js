const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /api/products — add product with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, unit, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({ name, price, unit, category, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products — fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;