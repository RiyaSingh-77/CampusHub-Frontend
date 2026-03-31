const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, rollNo, branch, year, section, phone, password, hostel, role } = req.body;

    const existing = await User.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: 'Roll number already registered' });

    // Only allow these 3 roles from signup; admin/society assigned manually
    const allowedRoles = ['student', 'vendor', 'mess_incharge'];
    const assignedRole = allowedRoles.includes(role) ? role : 'student';

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({
      name, rollNo, branch, year, section,
      phone, hostel, password: hashed,
      role: assignedRole,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    const user = await User.findOne({ rollNo });
    if (!user) return res.status(400).json({ message: 'Invalid roll number or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid roll number or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, hostel: user.hostel } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;