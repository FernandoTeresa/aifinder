// components/admin/AdminLoginForm.tsx
'use client';

import { useState } from 'react';

/**
 * Formulário de login do backoffice.
 * Envia a password para /api/admin/login, que define o cookie httpOnly
 * e depois recarrega /conta-admin para o servidor já ver o cookie.
 */
export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.error || `Erro ${res.status}`);
      } else {
        // Recarrega a página para o server ler o cookie (httpOnly)
        window.location.assign('/conta-admin');
      }
    } catch (err: any) {
      setMsg(err?.message || 'Erro de rede');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      <h1 className="mb-2 text-2xl font-semibold text-white">Área Administrativa</h1>
      <p className="mb-4 text-sm text-white/70">
        Introduz a password do administrador.
      </p>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="ADMIN_TOKEN"
        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white placeholder:text-white/40 outline-none"
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15 disabled:opacity-60"
      >
        {busy ? 'A entrar…' : 'Entrar'}
      </button>

      {msg && (
        <div className="mt-3 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
          {msg}
        </div>
      )}

      {/* Dica útil em desenvolvimento */}
      {process.env.NODE_ENV !== 'production' && (
        <p className="mt-3 text-xs text-white/40">
          Dica: a password é o valor de <code>ADMIN_TOKEN</code> no teu <code>.env.local</code>.
        </p>
      )}
    </form>
  );
}