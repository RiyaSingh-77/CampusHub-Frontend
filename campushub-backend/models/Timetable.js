const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  period:    Number,
  subject:   String,
  faculty:   String,
  room:      String,
  startTime: String,
  endTime:   String,
});

const DaySchema = new mongoose.Schema({
  day:   String,
  slots: [SlotSchema],
});

const TimetableSchema = new mongoose.Schema({
  branch:   { type: String, required: true },
  year:     { type: Number, required: true },
  section:  { type: String, required: true },
  semester: Number,
  schedule: [DaySchema],
  pdfUrl:   String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

TimetableSchema.index({ branch: 1, year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimetableSchema);