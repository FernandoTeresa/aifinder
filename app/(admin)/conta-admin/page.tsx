'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { slugify } from '@/lib/slugify';

type Tool = {
  id: string;
  name: string;
  slug: string;
  provider?: string | null;
  category?: string | null;
  website?: string | null;
  tier?: string | null;
  languages: string[];
  compliance: string[];
  tags: string[];
  quality?: number | null;
  match?: number | null;
  value?: number | null;
  pricing?: any;
  meta?: any;
  updated_at?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState<string>('');
  const [authed, setAuthed] = useState<boolean>(false);
  const [items, setItems] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  // form state
  const empty: Tool = useMemo(
    () => ({
      id: '',
      name: '',
      slug: '',
      provider: '',
      category: '',
      website: '',
      tier: 'Standard',
      languages: ['pt', 'en'],
      compliance: ['gdpr'],
      tags: [],
      quality: 80,
      match: 80,
      value: 80,
      pricing: { standard: { monthly: 9.9 }, premium: { monthly: 19.9 } },
      meta: {},
    }),
    []
  );
  const [current, setCurrent] = useState<Tool>(empty);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem('admin:token');
    if (t) {
      setToken(t);
      setAuthed(true);
      load(t);
    }
  }, []);

  async function load(tok = token) {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/ai', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao carregar');
      setItems(data.items || []);
    } catch (e: any) {
      toast.error(e?.message || 'Falha a carregar');
    } finally {
      setLoading(false);
    }
  }

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    sessionStorage.setItem('admin:token', token);
    setAuthed(true);
    load(token);
  }

  function logout() {
    sessionStorage.removeItem('admin:token');
    setAuthed(false);
    setToken('');
  }

  function startNew() {
    setCurrent({ ...empty });
    setEditing(true);
  }

  function startEdit(t: Tool) {
    setCurrent({ ...t });
    setEditing(true);
  }

  async function save() {
    try {
      const body = { ...current };
      if (!body.name) return toast.warning('Indica nome');
      if (!body.slug) body.slug = slugify(body.name);

      const res = await fetch('/api/admin/ai', {
        method: body.id ? 'PUT' : 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao gravar');

      toast.success(body.id ? 'Atualizado' : 'Criado');
      setEditing(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao gravar');
    }
  }

  async function remove(id: string) {
    if (!confirm('Apagar esta IA?')) return;
    try {
      const res = await fetch(`/api/admin/ai?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao apagar');
      toast.success('Removido');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao apagar');
    }
  }

  if (!authed) {
    return (
      <main className="relative z-10 mx-auto max-w-md px-4 pb-20 pt-24">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-white">Admin · Login</h1>
          <p className="mt-2 text-sm text-white/60">Insere o token de administração.</p>
          <form onSubmit={login} className="mt-4 space-y-3">
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="ADMIN_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Catálogo de IA</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={startNew}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Nova IA
          </button>
          <button
            onClick={logout}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:border-white/20 hover:bg-white/15"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        {loading ? (
          <p className="text-sm text-white/60">A carregar…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-white/60">Sem registos. Cria a primeira IA.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/50">
                    {t.provider || '—'} · {t.category || '—'} · {t.tier || '—'}
                  </div>
                </div>
                <div className="hidden text-xs text-white/50 md:block">
                  Qual:{t.quality ?? '—'} · Match:{t.match ?? '—'} · Valor:{t.value ?? '—'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(t)}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:border-white/20 hover:bg-white/15"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-200 hover:border-rose-400/50"
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Drawer simples para criar/editar */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {current.id ? 'Editar IA' : 'Nova IA'}
              </h2>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:border-white/20 hover:bg-white/15"
              >
                Fechar
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Nome" value={current.name} onChange={(v) => setCurrent({ ...current, name: v })} />
              <Text
                label="Slug"
                value={current.slug}
                onChange={(v) => setCurrent({ ...current, slug: v })}
                placeholder="auto a partir do nome"
              />
              <Text label="Provider" value={current.provider || ''} onChange={(v) => setCurrent({ ...current, provider: v })} />
              <Text label="Categoria" value={current.category || ''} onChange={(v) => setCurrent({ ...current, category: v })} />
              <Text label="Website" value={current.website || ''} onChange={(v) => setCurrent({ ...current, website: v })} />
              <Text label="Tier" value={current.tier || ''} onChange={(v) => setCurrent({ ...current, tier: v })} />

              <ArrayInput label="Línguas" value={current.languages} onChange={(arr) => setCurrent({ ...current, languages: arr })} />
              <ArrayInput label="Compliance" value={current.compliance} onChange={(arr) => setCurrent({ ...current, compliance: arr })} />
              <ArrayInput label="Tags" value={current.tags} onChange={(arr) => setCurrent({ ...current, tags: arr })} />

              <NumberInput label="Qualidade" value={current.quality ?? 0} onChange={(n) => setCurrent({ ...current, quality: n })} />
              <NumberInput label="Match" value={current.match ?? 0} onChange={(n) => setCurrent({ ...current, match: n })} />
              <NumberInput label="Valor" value={current.value ?? 0} onChange={(n) => setCurrent({ ...current, value: n })} />

              <JsonInput label="Pricing (JSON)" value={current.pricing || {}} onChange={(obj) => setCurrent({ ...current, pricing: obj })} />
              <JsonInput label="Meta (JSON)" value={current.meta || {}} onChange={(obj) => setCurrent({ ...current, meta: obj })} />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:border-white/20 hover:bg-white/15"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="text-sm text-white/80">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="text-sm text-white/80">
      {label}
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </label>
  );
}

function ArrayInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (arr: string[]) => void;
}) {
  const [str, setStr] = useState(value.join(','));
  useEffect(() => setStr(value.join(',')), [value]);
  return (
    <label className="text-sm text-white/80">
      {label} <span className="text-white/40">(separado por vírgulas)</span>
      <input
        value={str}
        onChange={(e) => {
          setStr(e.target.value);
          onChange(
            e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          );
        }}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </label>
  );
}

function JsonInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (o: any) => void;
}) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  useEffect(() => setText(JSON.stringify(value, null, 2)), [value]);
  return (
    <label className="text-sm text-white/80 sm:col-span-2">
      {label}
      <textarea
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            const obj = JSON.parse(e.target.value);
            onChange(obj);
          } catch {
            // ignore até ser JSON válido
          }
        }}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 font-mono text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </label>
  );
}
