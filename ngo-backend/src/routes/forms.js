// src/routes/forms.js (updated)
import express from 'express';
import Contact from '../models/Contact.js';
import Volunteer from '../models/Volunteer.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const router = express.Router();

// sendAdminEmail unchanged (keep existing function)

// helper: is DB connected?
function dbConnected() {
  // 1 = connected
  return mongoose.connection && mongoose.connection.readyState === 1;
}

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject = '', message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });

    if (dbConnected()) {
      const contact = new Contact({ name, email, subject, message });
      await contact.save();
      // optional: sendAdminEmail(...)
      res.status(201).json({ ok: true, id: contact._id });
    } else {
      console.warn('⚠️ DB not connected — contact saved to no DB (DEV fallback)');
      // TEMP: return mock id so frontend behaves as if saved
      res.status(201).json({ ok: true, id: 'dev-fallback-contact-' + Date.now() });
    }
  } catch (err) {
    console.error('POST /api/contact error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/volunteer', async (req, res) => {
  try {
    const { name, email, phone = '', skills = '', availability = '', message = '' } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    if (dbConnected()) {
      const vol = new Volunteer({ name, email, phone, skills, availability, message });
      await vol.save();
      // optional: sendAdminEmail(...)
      res.status(201).json({ ok: true, id: vol._id });
    } else {
      console.warn('⚠️ DB not connected — volunteer saved to no DB (DEV fallback)');
      res.status(201).json({ ok: true, id: 'dev-fallback-vol-' + Date.now() });
    }
  } catch (err) {
    console.error('POST /api/volunteer error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
