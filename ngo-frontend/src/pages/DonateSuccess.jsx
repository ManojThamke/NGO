// src/pages/DonateSuccess.jsx
import React, { useEffect, useState } from "react";

/**
 * DonateSuccess.jsx
 * - fetches Stripe checkout session by session_id in the URL
 * - shows animated success tick + donation summary (amount, id, email, date)
 * - copy to clipboard and print options
 *
 * This version avoids mixing `??` and `||` inline to prevent Babel/parser errors.
 */

export default function DonateSuccess() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null); // raw session object from backend/stripe
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id") || params.get("sessionId");
    if (!sessionId) {
      setLoading(false);
      setError("No session ID provided in URL.");
      return;
    }

    (async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/api/donations/session/${sessionId}`);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || `Server returned ${res.status}`);
          setLoading(false);
          return;
        }
        const json = await res.json();
        setInfo(json);
      } catch (e) {
        console.error(e);
        setError("Network error while fetching session.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // helpers to derive display values from the session object (avoid inline complex expressions)
  function getPaymentId(session) {
    if (!session) return "—";
    // prefer payment_intent id, then session id
    if (session.payment_intent) {
      if (typeof session.payment_intent === "string") return session.payment_intent;
      if (session.payment_intent.id) return session.payment_intent.id;
    }
    return session.id || "—";
  }

  // compute amount and currency from multiple possible places that Stripe may provide
  const amountRaw = (() => {
    if (!info) return null;
    // Try fields commonly present on session
    if (info.amount_total != null) return info.amount_total;
    // older shape or line items
    const displayAmount = info.display_items?.[0]?.amount;
    if (displayAmount != null) return displayAmount;
    // payment_intent amount fallback
    if (info.payment_intent?.amount != null) return info.payment_intent.amount;
    return null;
  })();

  const currencyRaw = (() => {
    if (!info) return null;
    if (info.currency) return info.currency;
    if (info.payment_intent?.currency) return info.payment_intent.currency;
    // fallback to 'usd'
    return "usd";
  })();

  const paymentMethodValue = (() => {
    if (!info) return "card";
    const m1 = info.payment_method_types?.[0];
    if (m1) return m1;
    const m2 = info.payment_intent?.payment_method_types?.[0];
    if (m2) return m2;
    return "card";
  })();

  const createdAt = (() => {
    if (!info) return null;
    // prefer payment_intent.created (seconds) then session.created
    if (info.payment_intent?.created) return info.payment_intent.created;
    if (info.created) return info.created;
    return null;
  })();

  function formatAmount(amount, currency) {
    if (amount == null) return "—";
    try {
      const num = Number(amount) / 100;
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: (currency || "USD").toUpperCase(),
      }).format(num);
    } catch {
      return `${Number(amount) / 100} ${currency || ""}`;
    }
  }

  function formatTimestamp(ts) {
    if (!ts) return "—";
    const millis = ts > 1e12 ? ts : ts * 1000;
    return new Date(millis).toLocaleString();
  }

  async function handleCopy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      alert("Copy failed. Select and copy manually.");
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#f8fbf9] flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header with animated check */}
          <div className="flex items-center gap-6">
            <div aria-hidden className="w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 120 120" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="54" stroke="url(#g1)" strokeWidth="6" strokeLinecap="round" className="circle-stroke" />
                <path d="M36 62 L52 78 L86 44" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="check-stroke" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">Payment Successful</h1>
              <p className="text-sm text-neutral-600 mt-1">Thank you — your generous support powers our work.</p>
            </div>
          </div>

          {/* Info boxes */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f6f9f7] p-4 rounded-lg border border-[#eef8f1]">
              <div className="text-xs text-neutral-500">Status</div>
              <div className="mt-1 text-sm font-medium text-green-700">Paid ✓</div>

              <div className="mt-4 text-xs text-neutral-500">Payment ID</div>
              <div className="mt-1 flex items-center gap-3">
                <div className="text-sm font-mono text-neutral-900 break-all">{getPaymentId(info)}</div>
                <button
                  onClick={() => handleCopy(getPaymentId(info))}
                  className="ml-auto text-xs px-2 py-1 rounded-md border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="mt-4 text-xs text-neutral-500">Date & time</div>
              <div className="mt-1 text-sm text-neutral-900">{formatTimestamp(createdAt)}</div>

              <div className="mt-4 text-xs text-neutral-500">Donor Email</div>
              <div className="mt-1 text-sm text-neutral-900">{info?.customer_email || info?.metadata?.email || "—"}</div>
            </div>

            <div className="bg-[#fff7f3] p-4 rounded-lg border border-[#fff0e9]">
              <div className="text-xs text-neutral-500">Amount</div>
              <div className="mt-1 text-2xl font-bold text-neutral-900">{formatAmount(amountRaw, currencyRaw)}</div>

              <div className="mt-4 text-xs text-neutral-500">Payment Method</div>
              <div className="mt-1 text-sm text-neutral-900">{paymentMethodValue}</div>

              <div className="mt-4 text-xs text-neutral-500">Receipt</div>
              <div className="mt-1 text-sm text-neutral-900">
                Stripe will send a receipt to the donor if an email was provided.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button onClick={handlePrint} className="px-4 py-2 rounded-md bg-neutral-100 border text-sm hover:bg-neutral-50">Print Receipt</button>
            <a href="/" className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90">Back to Home</a>

            <div className="ml-auto text-sm text-neutral-500">
              {loading ? "Verifying..." : error ? <span className="text-red-500">{error}</span> : "Confirmed"}
            </div>
          </div>

          {/* Optional debug JSON */}
          {info && (
            <details className="mt-6 p-4 bg-white border rounded-md text-xs text-neutral-600">
              <summary className="cursor-pointer select-none">Show session payload (debug)</summary>
              <pre className="mt-3 overflow-auto text-xs bg-[#f8f9fb] p-3 rounded">{JSON.stringify(info, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>

      {/* Inline styles for SVG animations */}
      <style>{`
        .circle-stroke {
          stroke-dasharray: 360;
          stroke-dashoffset: 360;
          transform-origin: 50% 50%;
          animation: circleReveal 0.9s ease forwards;
        }
        .check-stroke {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: drawCheck 0.45s 0.9s ease forwards;
        }

        @keyframes circleReveal {
          0% { stroke-dashoffset: 360; transform: scale(0.92); opacity: 0; }
          60% { stroke-dashoffset: 40; transform: scale(1.02); opacity: 1; }
          100% { stroke-dashoffset: 0; transform: scale(1); opacity: 1; }
        }

        @keyframes drawCheck {
          0% { stroke-dashoffset: 120; opacity: 0; transform: translateY(6px); }
          60% { stroke-dashoffset: 20; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .circle-stroke { stroke-width: 5; }
          .check-stroke { stroke-width: 6; }
        }
      `}</style>
    </div>
  );
}
