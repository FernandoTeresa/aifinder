'use client';

import { useState } from 'react';

export default function AdminLoginForm() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha no login');
      }

      // espelhar no localStorage para o Header
      try { localStorage.setItem('admin_token', token); } catch {}

      // refrescar a página para apanhar cookie e mudar o estado do Header
      window.location.assign('/conta-admin');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={doLogin} className="max-w-sm space-y-3">
      <label className="block text-sm text-white/80">
        Token de administrador
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
          placeholder="cola aqui o ADMIN_TOKEN"
        />
      </label>
      {err && <p className="text-sm text-red-400">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'A entrar...' : 'Entrar'}
      </button>
    </form>
  );
}
