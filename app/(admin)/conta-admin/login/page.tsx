'use client';
import { useState } from 'react';

export default function AdminLogin() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    setLoading(false);
    if (res.ok) window.location.href = '/admin/ai';
    else alert('Token inválido');
  }

  return (
    <main className="mx-auto max-w-md px-4 py-24">
      <h1 className="text-2xl font-semibold">Entrar (Admin)</h1>
      <p className="mt-2 text-sm opacity-70">Usa o <code>ADMIN_TOKEN</code>.</p>
      <form onSubmit={login} className="mt-6 space-y-3">
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="ADMIN_TOKEN"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button className="rounded-xl border px-4 py-2" disabled={loading}>
          {loading ? 'A entrar…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}