import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import Contact from '../models/Contact.js';
import Volunteer from '../models/Volunteer.js';

const router = express.Router();
router.use(adminAuth);

// GET /api/admin/analytics
router.get('/', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const totalVolunteers = await Volunteer.countDocuments();

    const today = new Date();
    today.setHours(0,0,0,0);
    const todayContacts = await Contact.countDocuments({ createdAt: { $gte: today } });
    const todayVolunteers = await Volunteer.countDocuments({ createdAt: { $gte: today } });

    // Monthly trend (last 6 months)
    const pipeline = [
      { $match: { createdAt: { $gte: new Date(Date.now() - 180*24*60*60*1000) } } },
      { $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          contacts: { $sum: { $cond: [{ $eq: ["$__t", "Contact"] }, 1, 0] } },
          volunteers: { $sum: { $cond: [{ $eq: ["$__t", "Volunteer"] }, 1, 0] } },
          total: { $sum: 1 }
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ];
    const trend = await Contact.aggregate(pipeline).catch(()=>[]);
    res.json({
      ok: true,
      totals: { contacts: totalContacts, volunteers: totalVolunteers },
      today: { contacts: todayContacts, volunteers: todayVolunteers },
      trend
    });
  } catch (err) {
    console.error('GET /api/admin/analytics error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
