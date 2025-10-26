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

// initialize stripe (empty string allowed but will error on calls)
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
        return res.json({ ok: true, sessionId: recentPending.stripeSessionId });
      }
    }

    const price_data = {
      currency,
      unit_amount: unitAmount,
      product_data: { name: recurring ? 'Monthly Donation' : 'Donation' }
    };

    const line_items = [{ price_data, quantity: 1 }];

    // Use the CLIENT_URL env if set; otherwise use your Render frontend URL by default
    const DEFAULT_CLIENT_URL = 'https://ngo-frontend1.onrender.com';
    const clientUrl = (process.env.CLIENT_URL || DEFAULT_CLIENT_URL).replace(/\/$/, '');

    const sessionParams = {
      payment_method_types: ['card'],
      mode: recurring ? 'subscription' : 'payment',
      line_items,
      success_url: `${clientUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/donate/cancel`,
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

    res.json({ ok: true, sessionId: session.id, url: session.url || null });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    const devMsg = process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Server error');
    res.status(500).json({ error: devMsg });
  }
});

// GET /api/donations/session/:id
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
 * Uses raw body for signature verification.
 */
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    let event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // verify signature in production / when secret present
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // WARNING: only for local/dev testing (no signature). Prefer configuring STRIPE_WEBHOOK_SECRET.
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET not configured. Webhook signature NOT verified (dev only).');
      try {
        event = JSON.parse(req.body.toString('utf8'));
      } catch (parseErr) {
        console.error('Failed to parse webhook body without verification', parseErr);
        return res.status(400).send('Invalid webhook payload');
      }
    }

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
    res.status(400).send(`Webhook error: ${err && err.message ? err.message : 'invalid event'}`);
  }
});

export default router;
