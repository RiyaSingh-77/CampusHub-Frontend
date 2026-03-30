const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String },
  image: { type: String },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);