const express   = require('express');
const router    = express.Router();
const { requireAuth: auth } = require('../middleware/auth');
const MessMenu  = require('../models/MessMenu');
const multer    = require('multer');
const ImageKit  = require('imagekit');

const imagekit = new ImageKit({
  publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/mess?hostel=Girls Hostel
router.get('/', async (req, res) => {
  try {
    const { hostel } = req.query;
    const query = hostel ? { hostel } : {};
    const menus = await MessMenu.find(query).populate('updatedBy', 'name');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mess/:id
router.get('/:id', async (req, res) => {
  try {
    const menu = await MessMenu.findById(req.params.id).populate('updatedBy', 'name');
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mess  — mess incharge creates/updates weekly text menu
router.post('/', auth, async (req, res) => {
  try {
    const { hostel, week } = req.body;
    if (!hostel) return res.status(400).json({ message: 'Hostel is required' });

    const menu = await MessMenu.findOneAndUpdate(
      { hostel },
      { hostel, week, updatedBy: req.user.id },
      { upsert: true, new: true }
    );
    res.json({ message: 'Menu updated successfully', menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mess/upload-image — upload menu as image
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    const { hostel } = req.body;
    if (!hostel) return res.status(400).json({ message: 'Hostel is required' });
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const fileBase64 = req.file.buffer.toString('base64');
    const mimeType   = req.file.mimetype; // e.g. image/jpeg

    imagekit.upload({
      file:     fileBase64,
      fileName: `mess_${hostel.replace(/\s+/g, '_')}_${Date.now()}.jpg`,
      folder:   '/mess-menus',
    }, async (error, result) => {
      if (error) return res.status(500).json({ message: error.message });

      const menu = await MessMenu.findOneAndUpdate(
        { hostel },
        { hostel, menuImage: result.url, updatedBy: req.user.id },
        { upsert: true, new: true }
      );
      res.json({ message: 'Menu image uploaded successfully', menuImage: result.url, menu });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/mess/:id — remove a menu entry
router.delete('/:id', auth, async (req, res) => {
  try {
    await MessMenu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
