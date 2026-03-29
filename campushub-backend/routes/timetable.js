const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const Timetable  = require('../models/Timetable');
const multer     = require('multer');
const ImageKit   = require('imagekit');

const imagekit = new ImageKit({
  publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/timetable?branch=CSE&year=1&section=A
router.get('/', async (req, res) => {
  try {
    const { branch, year, section } = req.query;
    const query = {};
    if (branch)  query.branch  = branch;
    if (year)    query.year    = Number(year);
    if (section) query.section = section;

    const timetable = await Timetable.findOne(query)
      .populate('uploadedBy', 'name rollNo');
    res.json(timetable || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/timetable/upload-pdf  (auth required)
router.post('/upload-pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    const { branch, year, section } = req.body;
    if (!branch || !year || !section) {
      return res.status(400).json({ message: 'Branch, year and section are required' });
    }

    // Upload PDF to ImageKit
    const uploaded = await imagekit.upload({
      file:     req.file.buffer,
      fileName: `timetable_${branch}_year${year}_${section}_${Date.now()}.pdf`,
      folder:   '/timetables',
    });

    // Upsert — update if exists, create if not
    const timetable = await Timetable.findOneAndUpdate(
      { branch, year: Number(year), section },
      {
        pdfUrl:     uploaded.url,
        uploadedBy: req.user.id,
        branch,
        year:       Number(year),
        section,
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'PDF uploaded successfully', pdfUrl: uploaded.url, timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/timetable  (admin only — for structured data)
router.post('/', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndUpdate(
      { branch: req.body.branch, year: req.body.year, section: req.body.section },
      req.body,
      { upsert: true, new: true }
    );
    res.status(201).json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
