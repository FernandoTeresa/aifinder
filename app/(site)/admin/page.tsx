'use client';
import { useEffect, useState } from 'react';
import { models as seed } from '@/lib/mockModels';

type Model = typeof seed[number];
const COOKIE = 'admin_ok';

export default function AdminPage(){
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const ok = document.cookie.split('; ').some(c => c.startsWith(`${COOKIE}=1`));
    setAuthed(ok);
    setModels(seed);
  }, []);

  function login(){
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (pwd === expected){
      document.cookie = `${COOKIE}=1; path=/; max-age=${60*60*4}`;
      setAuthed(true);
    } else alert('Password errada.');
  }

  function addBlank(){
    setModels(prev => [{ ...prev[0], id:`tmp-${Date.now()}`, name:'Novo Modelo', vendor:'—', url:'#' }, ...prev]);
  }
  function saveLocal(){
    localStorage.setItem('aifinder_admin_models', JSON.stringify(models));
    alert('Guardado no browser (demo).');
  }

  if (!authed) return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-3 text-2xl font-semibold">Admin</h1>
      <input type="password" placeholder="Password"
        value={pwd} onChange={e=>setPwd(e.target.value)}
        className="w-full rounded-xl border px-3 py-2" />
      <button onClick={login} className="mt-3 w-full rounded-xl border px-3 py-2">Entrar</button>
    </main>
  );

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Catálogo de IAs</h1>
        <button onClick={addBlank} className="rounded-xl border px-3 py-1.5 text-sm">Adicionar</button>
        <button onClick={saveLocal} className="rounded-xl border px-3 py-1.5 text-sm">Guardar (local)</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Nome</th>
              <th className="border px-2 py-1">Vendor</th>
              <th className="border px-2 py-1">Preço</th>
              <th className="border px-2 py-1">Qual.</th>
              <th className="border px-2 py-1">Match</th>
              <th className="border px-2 py-1">Valor</th>
              <th className="border px-2 py-1">URL</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={m.id} className="odd:bg-white/60">
                <td className="border px-2 py-1">{m.id}</td>
                <td className="border px-2 py-1"><input className="w-full bg-transparent" value={m.name} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,name:e.target.value}:x))}/></td>
                <td className="border px-2 py-1"><input className="w-full bg-transparent" value={m.vendor} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,vendor:e.target.value}:x))}/></td>
                <td className="border px-2 py-1"><select className="bg-transparent" value={m.priceTier} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,priceTier:e.target.value as any}:x))}><option value="free">free</option><option value="standard">standard</option><option value="premium">premium</option></select></td>
                <td className="border px-2 py-1"><input type="number" className="w-16 bg-transparent" value={m.quality} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,quality:+e.target.value}:x))}/></td>
                <td className="border px-2 py-1"><input type="number" className="w-16 bg-transparent" value={m.match} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,match:+e.target.value}:x))}/></td>
                <td className="border px-2 py-1"><input type="number" className="w-16 bg-transparent" value={m.value} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,value:+e.target.value}:x))}/></td>
                <td className="border px-2 py-1"><input className="w-full bg-transparent" value={m.url} onChange={e=>setModels(a=>a.map((x,ix)=>ix===i?{...x,url:e.target.value}:x))}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}