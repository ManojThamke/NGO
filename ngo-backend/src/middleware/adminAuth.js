// ngo-backend/src/middleware/adminAuth.js
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const ADMIN_PASS = process.env.ADMIN_PASSWORD || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

export default function adminAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Legacy fallback: allow raw admin password (keeps backwards compatibility)
  if (ADMIN_PASS && token === ADMIN_PASS) {
    return next();
  }

  // Prefer JWT verification
  if (!JWT_SECRET) {
    // If no JWT secret configured, deny access when not using legacy password
    return res.status(403).json({ error: 'Admin JWT not configured' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // optional: check payload.role === 'admin'
    if (payload && payload.role === 'admin') {
      req.admin = { id: payload.sub || null };
      return next();
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    console.error('adminAuth jwt verify error', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
