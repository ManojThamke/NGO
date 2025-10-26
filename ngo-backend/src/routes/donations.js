// ngo-backend/src/routes/donations.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Donation from '../models/Donation.js';
import bodyParser from 'body-parser';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Stripe operations will fail until this is configured.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const router = express.Router();

/**
 * POST /api/donations/create-checkout-session
 * body: { amount, currency, email, recurring }
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency = 'usd', email = null, recurring = false } = req.body || {};

    // Basic validation
    if (amount === undefined || amount === null || Number(amount) <= 0 || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (typeof currency !== 'string' || currency.length !== 3) {
      return res.status(400).json({ error: 'Invalid currency' });
    }
    if (typeof recurring !== 'boolean') {
      return res.status(400).json({ error: 'Invalid recurring flag' });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Payment provider not configured' });
    }

    const numericAmount = Number(amount);
    const unitAmount = Math.round(numericAmount * 100); // cents

    // Prevent accidental duplicate pending sessions for same email + amount (simple guard)
    if (email) {
      const recentPending = await Donation.findOne({
        email,
        amount: numericAmount,
        status: 'pending',
        createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 10) } // last 10 minutes
      }).lean().exec();
      if (recentPending) {
        // return existing session url if available to avoid creating duplicates
        // (You may remove this behavior if not desired)
        return res.json({ ok: true, sessionId: recentPending.stripeSessionId });
      }
    }

    const price_data = {
      currency,
      unit_amount: unitAmount,
      product_data: { name: recurring ? 'Monthly Donation' : 'Donation' }
    };

    const line_items = [{ price_data, quantity: 1 }];

    // create a checkout session
    const sessionParams = {
      payment_method_types: ['card'],
      mode: recurring ? 'subscription' : 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donate/cancel`,
      metadata: { email: email || '' }
    };
    if (email) sessionParams.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionParams);

    // create DB record (pending)
    await Donation.create({
      email: email || null,
      amount: numericAmount,
      currency,
      stripeSessionId: session.id,
      status: 'pending',
      recurring: !!recurring
    });

    // Prefer to return session.url when available (newer Stripe)
    res.json({ ok: true, sessionId: session.id, url: session.url || null });
  } catch (err) {
    // Log full error server-side for debugging
    console.error('create-checkout-session error:', err);

    // Return detailed message in development, generic in production
    const devMsg = process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Server error');
    res.status(500).json({ error: devMsg });
  }
});

// Optional: fetch session details (server-verified)
router.get('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing session id' });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Payment provider not configured' });

    const session = await stripe.checkout.sessions.retrieve(id, { expand: ['payment_intent'] });
    res.json(session);
  } catch (err) {
    console.error('fetch session err', err);
    const devMsg = process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Server error');
    res.status(500).json({ error: devMsg });
  }
});

/**
 * Stripe webhook.
 * This route uses raw body to verify signature.
 * Make sure Stripe webhook forwarding (stripe CLI or production webhook) is configured.
 */
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET not configured. Webhook signature verification will fail.');
    }
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await Donation.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            status: 'paid',
            stripePaymentIntent: session.payment_intent,
            paidAt: new Date(),
            email: session.customer_email || (session.metadata && session.metadata.email) || null
          }
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        await Donation.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          { status: 'active', lastPaymentAt: new Date() }
        );
        break;
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = event.data.object;
        await Donation.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: 'failed' }
        );
        break;
      }

      default:
        // ignore other event types
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err && err.message ? err.message : err);
    // Stripe expects a 4xx or 5xx for failures
    res.status(400).send(`Webhook error: ${err && err.message ? err.message : 'invalid event'}`);
  }
});

export default router;
