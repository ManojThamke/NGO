// ngo-backend/src/models/Donation.js
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  email: { type: String, default: null },
  amount: { type: Number, required: true }, // in major unit (e.g., 25 = $25)
  currency: { type: String, default: 'usd' },
  stripeSessionId: { type: String, index: true },
  stripePaymentIntent: String,
  stripeSubscriptionId: String,
  status: { type: String, enum: ['pending','paid','failed','active','cancelled'], default: 'pending' },
  recurring: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
  lastPaymentAt: Date
});

export default mongoose.model('Donation', donationSchema);
