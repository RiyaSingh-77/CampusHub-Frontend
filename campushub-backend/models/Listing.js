const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String, enum: ['lab-coat','drafter','books','clothes','electronics','other'], required: true },
  type:        { type: String, enum: ['sell','lend'], required: true },
  price:       { type: Number, required: true },
  condition:   { type: String, enum: ['like-new','good','fair'], required: true },
  images:      [String],
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['active','sold','lent'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);