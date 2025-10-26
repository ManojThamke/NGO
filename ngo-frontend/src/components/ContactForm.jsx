// src/components/ContactForm.jsx
import React, { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    if (!form.name || !form.email || !form.message) {
      setResult({ ok: false, message: 'Please fill required fields.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: 'Thank you — we received your message.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setResult({ ok: false, message: data.error || 'Server error' });
      }
    } catch (err) {
      setResult({ ok: false, message: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-xl">
      <div className="grid gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Name *</span>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 p-2 border rounded-md" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Email *</span>
          <input name="email" value={form.email} onChange={handleChange} className="mt-1 p-2 border rounded-md" type="email" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Subject</span>
          <input name="subject" value={form.subject} onChange={handleChange} className="mt-1 p-2 border rounded-md" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Message *</span>
          <textarea name="message" value={form.message} onChange={handleChange} className="mt-1 p-2 border rounded-md h-32" />
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-md">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {result && (
            <div className={`text-sm ${result.ok ? 'text-green-600' : 'text-red-600'}`}>
              {result.message}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
