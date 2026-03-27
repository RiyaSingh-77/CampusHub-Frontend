const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  rollNo:   { type: String, required: true, unique: true },
  branch:   { type: String, required: true },
  year:     { type: Number, required: true },
  section:  { type: String },
  phone:    { type: String, required: true },
  hostel:   { type: String },
  password: { type: String, required: true },
  role:     { type: String, enum: ['student','admin','society','vendor'], default: 'student' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);