// campushub-backend/routes/products.js

const express = require('express');
const multer = require('multer');
const ImageKit = require('imagekit');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// GET — public
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
      const { name, price, unit, category, emoji } = req.body;

      let imageUrl = null;

      // ✅ Upload to ImageKit if image was provided
      if (req.file) {
        const uploaded = await imagekit.upload({
          file: req.file.buffer,
          fileName: `product_${Date.now()}`,
          folder: '/campushub/products',
        });
        imageUrl = uploaded.url;
      }

      const product = await Product.create({
        name,
        price,
        unit,
        category,
        emoji: emoji || '🛒',
        imageUrl,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error('Product POST error:', err);
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

