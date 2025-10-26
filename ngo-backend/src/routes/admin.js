// ngo-backend/src/routes/admin.js
import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import Contact from '../models/Contact.js';
import Volunteer from '../models/Volunteer.js';
import { Parser as Json2csvParser } from 'json2csv';

const router = express.Router();

// Protect all admin routes with the admin password middleware
router.use(adminAuth);

/**
 * GET /api/admin/contacts
 * GET /api/admin/volunteers
 */
router.get('/contacts', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 500, 5000);
    const docs = await Contact.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
    res.json({ ok: true, data: docs });
  } catch (err) {
    console.error('GET /api/admin/contacts error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/volunteers', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 500, 5000);
    const docs = await Volunteer.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
    res.json({ ok: true, data: docs });
  } catch (err) {
    console.error('GET /api/admin/volunteers error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE /api/admin/contact/:id
 * DELETE /api/admin/volunteer/:id
 */
router.delete('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/admin/contact error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/volunteer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Volunteer.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/admin/volunteer error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/admin/export?type=contacts|volunteers
 * Returns a CSV file download (protected)
 */
router.get('/export', async (req, res) => {
  try {
    const type = (req.query.type || 'contacts').toLowerCase();
    let docs = [];
    if (type === 'contacts') {
      docs = await Contact.find().sort({ createdAt: -1 }).lean().exec();
    } else if (type === 'volunteers' || type === 'volunteer') {
      docs = await Volunteer.find().sort({ createdAt: -1 }).lean().exec();
    } else {
      return res.status(400).json({ error: 'Invalid type. Use contacts or volunteers' });
    }

    // Normalize rows
    const rows = docs.map(d => ({
      _id: d._id?.toString() ?? '',
      name: d.name ?? '',
      email: d.email ?? '',
      phone: d.phone ?? '',
      subject: d.subject ?? '',
      skills: d.skills ?? '',
      availability: d.availability ?? '',
      message: (d.message ?? '').replace(/\r?\n|\r/g, ' '),
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : ''
    }));

    // Choose fields (ensure stable order)
    const fields = ['_id','name','email','phone','subject','skills','availability','message','createdAt'];
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment(`${type}-${new Date().toISOString().slice(0,10)}.csv`);
    // prepend BOM for Excel compatibility
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error('GET /api/admin/export error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
