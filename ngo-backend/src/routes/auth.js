// ngo-backend/src/routes/auth.js
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const router = express.Router();
const ADMIN_PASS = process.env.ADMIN_PASSWORD || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '6h';

/**
 * POST /api/admin/auth/login
 * Body: { password: "<admin password>" }
 * Returns: { ok: true, token: "<jwt>" } on success
 */
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Missing password' });

  // verify against ADMIN_PASSWORD in .env
  if (!ADMIN_PASS) return res.status(403).json({ error: 'Admin access not configured' });
  if (password !== ADMIN_PASS) return res.status(401).json({ error: 'Invalid password' });

  if (!JWT_SECRET) {
    console.warn('JWT_SECRET not configured; returning legacy token (password) - consider setting JWT_SECRET in .env');
    // Fallback: return the raw admin password as token (not ideal). Prefer to set JWT_SECRET.
    return res.json({ ok: true, token: ADMIN_PASS });
  }

  // sign JWT
  const payload = { role: 'admin' };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return res.json({ ok: true, token });
});

export default router;
