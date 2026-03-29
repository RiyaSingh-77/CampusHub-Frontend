const express   = require('express');
const router    = express.Router();
const { requireAuth: auth } = require('../middleware/auth');
const Timetable = require('../models/Timetable');
const multer    = require('multer');
const ImageKit  = require('imagekit');

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

// POST /api/timetable/upload-pdf
router.post('/upload-pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    const { branch, year, section } = req.body;
    if (!branch || !year || !section)
      return res.status(400).json({ message: 'Branch, year and section are required' });

    const fileBase64 = req.file.buffer.toString('base64');

    imagekit.upload({
      file:     fileBase64,
      fileName: `timetable_${branch}_year${year}_${section}_${Date.now()}.pdf`,
      folder:   '/timetables',
    }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }

      const timetable = await Timetable.findOneAndUpdate(
        { branch, year: Number(year), section },
        {
          pdfUrl:     result.url,
          uploadedBy: req.user.id,
          branch,
          year:       Number(year),
          section,
        },
        { upsert: true, new: true }
      );

      res.json({ message: 'PDF uploaded successfully', pdfUrl: result.url, timetable });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/timetable (admin - structured data)
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

// DELETE /api/timetable/delete-pdf
router.delete('/delete-pdf', auth, async (req, res) => {
  try {
    const { branch, year, section } = req.query;

    const timetable = await Timetable.findOne({
      branch, year: Number(year), section
    });

    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    if (!timetable.pdfUrl) return res.status(400).json({ message: 'No PDF to delete' });

    // Remove PDF URL from DB
    timetable.pdfUrl = null;
    timetable.uploadedBy = null;
    await timetable.save();

    res.json({ message: 'PDF removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;