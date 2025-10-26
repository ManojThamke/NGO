// src/components/DonateButton.jsx
import React, { useState } from 'react';

export default function DonateButton({ preset = 25 }) {
  const [loading, setLoading] = useState(false);

  async function goDonate(amount = preset) {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'usd', email: null, recurring: false })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create session');

      // Prefer redirect to session.url if provided (Stripe new API)
      if (json.url) {
        window.location.href = json.url;
        return;
      }

      // Fallback: redirect using stripe.js
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId: json.sessionId });
      if (error) throw error;
    } catch (err) {
      alert('Donation failed: ' + (err.message || err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={() => goDonate()} className="bg-primary text-white px-5 py-2 rounded-md">
      {loading ? 'Opening...' : `Donate $${preset}`}
    </button>
  );
}
