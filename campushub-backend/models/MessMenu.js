const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  breakfast: { type: String, default: '' },
  lunch:     { type: String, default: '' },
  snacks:    { type: String, default: '' },
  dinner:    { type: String, default: '' },
});

const messMenuSchema = new mongoose.Schema({
  hostel: {
    type: String,
    required: true,
    enum: ['Hostel 1 (Boys)', 'Hostel 2 (Boys)', 'Girls Hostel'],
  },
  week: {
    monday:    mealSchema,
    tuesday:   mealSchema,
    wednesday: mealSchema,
    thursday:  mealSchema,
    friday:    mealSchema,
    saturday:  mealSchema,
    sunday:    mealSchema,
  },
  menuImage: { type: String, default: null }, // ImageKit URL
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('MessMenu', messMenuSchema);
