// src/models/Volunteer.js
import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  skills: { type: String, trim: true },
  availability: { type: String, trim: true },
  message: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Volunteer', VolunteerSchema);
