const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  unit:      { type: String, required: true }, // kg, pack, dozen etc
  category:  { type: String, enum: ['fruits', 'vegetables', 'grocery'], required: true },
  imageUrl:  { type: String, default: null },  // path like /uploads/filename.jpg
  emoji:     { type: String, default: '🛒' },  // fallback if no image
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);