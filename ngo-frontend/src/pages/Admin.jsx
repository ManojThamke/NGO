// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminList({ title, items = [], onDelete }) {
  if (!items.length) return <div className="text-sm text-neutral900/70">No entries yet.</div>;
  return (
    <div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id || item.id} className="bg-white p-3 rounded-md shadow-sm flex justify-between items-start">
            <div>
              <div className="text-sm font-semibold">
                {item.name} <span className="text-xs text-neutral900/60">({item.email})</span>
              </div>
              <div className="text-xs text-neutral900/70 mt-1">{item.message || item.skills || '—'}</div>
              <div className="text-xs text-neutral900/60 mt-2">{new Date(item.createdAt || item.created_at || Date.now()).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onDelete(item._id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [contacts, setContacts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // NEW authenticate using POST /api/admin/auth/login -> receives { ok: true, token }
  async function authenticate() {
    if (!password) {
      alert('Enter admin password');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const json = await res.json();
      if (!res.ok) {
        alert('Login failed: ' + (json.error || res.status));
        return;
      }
      // json.token will be the JWT (or legacy admin password if JWT_SECRET not set)
      setToken(json.token);
      // clear password input for security
      setPassword('');
      // load initial data
      await Promise.all([loadAll(json.token), loadAnalytics(json.token)]);
    } catch (err) {
      alert('Network error while authenticating');
      console.error(err);
    }
  }

  async function loadAll(auth) {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${auth}` };
      const [cRes, vRes] = await Promise.all([
        fetch(`${apiBase}/api/admin/contacts`, { headers }),
        fetch(`${apiBase}/api/admin/volunteers`, { headers })
      ]);
      if (cRes.ok && vRes.ok) {
        const cJson = await cRes.json();
        const vJson = await vRes.json();
        setContacts(cJson.data || []);
        setVolunteers(vJson.data || []);
      } else {
        const err = await cRes.json().catch(() => ({})) || await vRes.json().catch(() => ({}));
        alert('Auth failed or admin API error: ' + (err.error || 'Unauthorized'));
      }
    } catch (err) {
      alert('Network error while loading admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(type, id) {
    if (!confirm('Delete this entry?')) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch(`${apiBase}/api/admin/${type}/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        if (type === 'contact') setContacts(prev => prev.filter(p => p._id !== id));
        if (type === 'volunteer') setVolunteers(prev => prev.filter(p => p._id !== id));
      } else {
        const j = await res.json().catch(() => ({}));
        alert('Delete failed: ' + (j.error || 'Server error'));
      }
    } catch (err) {
      alert('Network error on delete');
      console.error(err);
    }
  }

  async function exportCSV(type) {
    try {
      const res = await fetch(`${apiBase}/api/admin/export?type=${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert('Export failed: ' + (j.error || res.status));
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Network error while exporting');
      console.error(err);
    }
  }

  async function loadAnalytics(auth) {
    try {
      const headers = { 'Authorization': `Bearer ${auth}` };
      const res = await fetch(`${apiBase}/api/admin/analytics`, { headers });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        console.warn('Analytics fetch failed', j);
        setStats(null);
        return;
      }
      const json = await res.json();
      if (json.ok) setStats(json);
    } catch (e) {
      console.error('Analytics error', e);
      setStats(null);
    }
  }

  useEffect(() => {
    // if token exists (e.g., user refreshed while authenticated in-memory), load data
    if (token) {
      loadAll(token);
      loadAnalytics(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading text-primary mb-4">Admin — Submissions</h1>

      {!token ? (
        <div className="max-w-md">
          <p className="mb-3 text-neutral900/70">Enter admin password to view submissions (dev panel).</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 border rounded-md w-full mb-3" placeholder="Admin password" />
          <div className="flex gap-3">
            <button onClick={authenticate} className="bg-primary text-white px-4 py-2 rounded-md">Authenticate</button>
            <button onClick={() => { setPassword(''); setToken(''); }} className="px-4 py-2 rounded-md border">Clear</button>
          </div>
        </div>
      ) : (
        <div>
          {/* Analytics summary (if available) */}
          {stats && (
            <div className="bg-white p-4 rounded-md shadow mb-8">
              <h2 className="text-2xl font-heading mb-4">📊 Summary</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 border rounded-md text-center">
                  <div className="text-sm text-neutral900/70">Total Contacts</div>
                  <div className="text-2xl font-bold">{stats.totals?.contacts ?? 0}</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-sm text-neutral900/70">Total Volunteers</div>
                  <div className="text-2xl font-bold">{stats.totals?.volunteers ?? 0}</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-sm text-neutral900/70">New Contacts Today</div>
                  <div className="text-2xl font-bold text-primary">{stats.today?.contacts ?? 0}</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-sm text-neutral900/70">New Volunteers Today</div>
                  <div className="text-2xl font-bold text-primary">{stats.today?.volunteers ?? 0}</div>
                </div>
              </div>

              {stats.trend?.length ? (
                <Bar
                  data={{
                    labels: stats.trend.map(t => `${t._id.month}/${t._id.year}`),
                    datasets: [
                      { label: 'Contacts', data: stats.trend.map(t => t.contacts || 0), backgroundColor: '#16a34a' },
                      { label: 'Volunteers', data: stats.trend.map(t => t.volunteers || 0), backgroundColor: '#2563eb' }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              ) : (
                <div className="text-center text-sm text-neutral900/60">No trend data yet.</div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <strong>Authenticated</strong>
              <div className="text-xs text-neutral900/60">Token stored in memory for session</div>
            </div>

            <div>
              <button onClick={() => Promise.all([loadAll(token), loadAnalytics(token)])} className="px-3 py-1 rounded-md border mr-2">Refresh</button>

              <button onClick={() => exportCSV('contacts')} className="px-3 py-1 rounded-md border mr-2">Export Contacts</button>

              <button onClick={() => exportCSV('volunteers')} className="px-3 py-1 rounded-md border mr-2">Export Volunteers</button>

              <button onClick={() => { setToken(''); setPassword(''); setContacts([]); setVolunteers([]); setStats(null); }} className="px-3 py-1 rounded-md border">Logout</button>
            </div>
          </div>

          {loading ? <div>Loading...</div> : (
            <div className="grid lg:grid-cols-2 gap-8">
              <AdminList title="Contact Messages" items={contacts} onDelete={(id) => handleDelete('contact', id)} />
              <AdminList title="Volunteer Applications" items={volunteers} onDelete={(id) => handleDelete('volunteer', id)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
