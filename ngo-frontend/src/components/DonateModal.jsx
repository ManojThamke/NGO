// src/components/DonateModal.jsx
import React, { useState } from 'react';

export default function DonateModal({ open, onClose, defaultAmount = 25 }) {
  const [amount, setAmount] = useState(defaultAmount);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  async function createSession(amountValue, recurring = false) {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/donations/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amountValue),
          currency: 'usd',
          email: email || null,
          recurring: !!recurring
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create session');
      if (json.url) window.location.href = json.url;
      else {
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        const { error } = await stripe.redirectToCheckout({ sessionId: json.sessionId });
        if (error) throw error;
      }
    } catch (err) {
      alert('Donation failed: ' + (err.message || err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 z-60">
        <h3 className="text-lg font-semibold mb-2">Donate to support our work</h3>
        <p className="text-sm text-neutral900/70 mb-4">
          Choose an amount or enter a custom gift. You’ll be redirected to Stripe to complete payment.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[10, 25, 50].map(a => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`py-2 rounded-md border ${amount === a ? 'bg-primary text-white' : 'bg-white'}`}
            >
              ${a}
            </button>
          ))}
        </div>

        <label className="text-xs text-neutral900/70">Custom amount (USD)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md mb-3"
        />

        <label className="text-xs text-neutral900/70">Email (optional — for receipt)</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full p-2 border rounded-md mb-4"
        />

        <div className="flex justify-between items-center">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>

          <div className="flex gap-2">
            <button
              onClick={() => createSession(amount, false)}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-primary text-white"
            >
              {loading ? 'Opening...' : `Donate $${amount}`}
            </button>
            <button
              onClick={() => createSession(amount, true)}
              disabled={loading}
              className="px-3 py-2 rounded-md border"
            >
              {loading ? 'Opening...' : 'Monthly'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
