const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  societyName:  { type: String, required: true },
  societyAbbr:  { type: String, required: true },
  contactEmail: { type: String, required: true },
  eventTitle:   { type: String, required: true },
  eventDesc:    { type: String, required: true },
  dateStart:    { type: String, required: true },
  dateEnd:      { type: String, required: true },
  venue:        { type: String, required: true },
  tags:         { type: String, default: '' },
  registerUrl:  { type: String, default: '' },
  status:       { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
