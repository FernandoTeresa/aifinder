'use client';
import { useEffect, useState } from 'react';

type Tool = {
  id?: string;
  name: string;
  slug?: string;
  provider?: string;
  tier?: string;
  description?: string;
  category?: string;
  language?: string;
  tags?: string[];
  quality?: number;
  match?: number;
  value?: number;
  url?: string;
};

const empty: Tool = { name: '', slug: '', provider: '', tier: 'standard', description: '', category: '', language: 'PT', tags: [], quality: 0, match: 0, value: 0, url: '' };

export default function AdminAI() {
  const [items, setItems] = useState<Tool[]>([]);
  const [form, setForm] = useState<Tool>(empty);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  async function load() {
    const r = await fetch('/api/ai?limit=200', { cache: 'no-store' });
    setItems(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/admin/ai', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { setForm(empty); load(); } else alert('Erro ao gravar');
  }
  async function del(id: string) {
    if (!confirm('Apagar?')) return;
    const r = await fetch(`/api/admin/ai/${id}`, { method: 'DELETE' });
    if (r.ok) load(); else alert('Erro ao apagar');
  }
  async function importCsv() {
    if (!csvFile) return alert('Seleciona um CSV');
    const fd = new FormData();
    fd.append('file', csvFile);
    const r = await fetch('/api/admin/ai/import', { method: 'POST', body: fd });
    const data = await r.json();
    if (!r.ok) return alert(data?.error || 'Falha no import');
    alert(`Importadas: ${data.inserted}, Atualizadas: ${data.upserted}`);
    setCsvFile(null);
    load();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Catálogo de IAs</h1>
        <a className="rounded-xl border px-3 py-1.5" href="/">Ver site</a>
      </header>

      {/* Formulário */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold">Criar/editar</h2>
        <form onSubmit={save} className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border px-3 py-2" placeholder="name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
          <input className="rounded-xl border px-3 py-2" placeholder="slug" value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value})}/>
          <input className="rounded-xl border px-3 py-2" placeholder="provider" value={form.provider} onChange={(e)=>setForm({...form, provider:e.target.value})}/>
          <input className="rounded-2xl border px-3 py-2" placeholder="tier (free/standard/premium)" value={form.tier} onChange={(e)=>setForm({...form, tier:e.target.value})}/>
          <input className="rounded-xl border px-3 py-2" placeholder="category" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}/>
          <input className="rounded-xl border px-3 py-2" placeholder="language" value={form.language} onChange={(e)=>setForm({...form, language:e.target.value})}/>
          <input className="rounded-xl border px-3 py-2" placeholder="tags vírgulas" value={(form.tags||[]).join(',')} onChange={(e)=>setForm({...form, tags:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/>
          <input className="rounded-xl border px-3 py-2" placeholder="url" value={form.url} onChange={(e)=>setForm({...form, url:e.target.value})}/>
          <textarea className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
          <div className="grid grid-cols-3 gap-3 md:col-span-2">
            <input className="rounded-xl border px-3 py-2" type="number" min={0} max={100} placeholder="quality" value={form.quality} onChange={(e)=>setForm({...form, quality: Number(e.target.value)})}/>
            <input className="rounded-xl border px-3 py-2" type="number" min={0} max={100} placeholder="match" value={form.match} onChange={(e)=>setForm({...form, match: Number(e.target.value)})}/>
            <input className="rounded-xl border px-3 py-2" type="number" min={0} max={100} placeholder="value" value={form.value} onChange={(e)=>setForm({...form, value: Number(e.target.value)})}/>
          </div>
          <div className="md:col-span-2">
            <button className="rounded-xl border px-4 py-2">Gravar</button>
          </div>
        </form>
      </section>

      {/* Import CSV */}
      <section className="mt-6 rounded-2xl border p-4">
        <h2 className="font-semibold">Import CSV</h2>
        <p className="mt-1 text-sm opacity-70">Formato: <code>name,slug,provider,tier,description,category,language,tags,quality,match,value,url</code> (tags separadas por |)</p>
        <div className="mt-3 flex items-center gap-3">
          <input type="file" accept=".csv" onChange={(e)=>setCsvFile(e.target.files?.[0]||null)} />
          <button className="rounded-xl border px-3 py-1.5" onClick={importCsv}>Importar</button>
          <a className="rounded-xl border px-3 py-1.5" href="/api/admin/ai/sample-csv">Baixar modelo</a>
        </div>
      </section>

      {/* Tabela */}
      <section className="mt-6 rounded-2xl border p-4">
        <h2 className="font-semibold">Lista ({items.length})</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-60">
              <tr><th>Nome</th><th>Prov.</th><th>Tier</th><th>Qual</th><th>Match</th><th>Valor</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((t)=>(
                <tr key={t.id} className="border-t">
                  <td className="py-1">{t.name}</td>
                  <td>{t.provider}</td>
                  <td>{t.tier}</td>
                  <td>{t.quality}</td>
                  <td>{t.match}</td>
                  <td>{t.value}</td>
                  <td className="text-right">
                    <button className="rounded border px-2 py-1 mr-2" onClick={()=>setForm(t)}>Editar</button>
                    {t.id && <button className="rounded border px-2 py-1" onClick={()=>del(t.id!)}>Apagar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}