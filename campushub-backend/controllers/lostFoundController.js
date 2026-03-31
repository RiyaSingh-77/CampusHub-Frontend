const LostFound = require('../models/LostFound');
const multer = require('multer');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const upload = multer({ storage: multer.memoryStorage() });
exports.uploadMiddleware = upload.single('image');

// GET all items
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
    const { title, description, category, location, date, name, phone, type } = req.body;

    let imageUrl = null;
    if (req.file) {
      const uploaded = await imagekit.upload({
        file:     req.file.buffer,
        fileName: `lostfound_${Date.now()}_${req.file.originalname}`,
        folder:   '/lostfound',
      });
      imageUrl = uploaded.url;
    }

    const item = await LostFound.create({
      type, title, description, category,
      location, date, name, phone,
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE item
exports.deleteItem = async (req, res) => {
  try {
    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH resolve
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