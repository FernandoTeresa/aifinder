// app/(admin)/conta-admin/ia/page.tsx
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

async function assertAdmin() {
  const h = await headers();
  const token =
    (await cookies()).get('admin_token')?.value ||
    h.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    redirect('/');
  }
}

type AiTool = {
  id: string;
  name: string;
  provider: string;
  tier: string;
  language: string;
  quality: number | null;
  match: number | null;
  value: number | null;
};

export default async function AdminIaPage() {
  await assertAdmin();

  // Inicialmente vamos só buscar uma lista simples da API admin (a seguir criamos a rota).
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/ai/list`, {
    headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN || ''}` },
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({ items: [] }))) as { items: AiTool[] };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Gestão de IAs</h1>
        <p className="mt-2 text-sm text-white/70">Lista, adição/edição e remoção de ferramentas de IA.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="#novo"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:border-white/20 hover:text-white"
          >
            + Nova IA (breve)
          </a>
          <a
            href="/api/admin/ai/ingest/src=sample_csv"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:border-white/20 hover:text-white"
          >
            Ingest de CSV (stub)
          </a>
          <a
            href="/api/admin/ai/ingest/src=provider_api"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:border-white/20 hover:text-white"
          >
            Ingest de Provider API (stub)
          </a>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left">Nome</th>
                <th className="px-3 py-2 text-left">Provider</th>
                <th className="px-3 py-2">Tier</th>
                <th className="px-3 py-2">Idioma</th>
                <th className="px-3 py-2">Qualidade</th>
                <th className="px-3 py-2">Match</th>
                <th className="px-3 py-2">Valor</th>
                <th className="px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {(data.items || []).map((t) => (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="px-3 py-2">{t.name}</td>
                  <td className="px-3 py-2 text-white/70">{t.provider}</td>
                  <td className="px-3 py-2 text-center text-white/70">{t.tier}</td>
                  <td className="px-3 py-2 text-center text-white/70">{t.language}</td>
                  <td className="px-3 py-2 text-center">{t.quality ?? '—'}</td>
                  <td className="px-3 py-2 text-center">{t.match ?? '—'}</td>
                  <td className="px-3 py-2 text-center">{t.value ?? '—'}</td>
                  <td className="px-3 py-2 text-center">
                    <a className="rounded-lg bg-white/5 px-2 py-1 text-xs hover:bg-white/10" href="#">
                      Editar
                    </a>
                    <a className="ml-2 rounded-lg bg-white/5 px-2 py-1 text-xs text-red-300 hover:bg-white/10" href="#">
                      Remover
                    </a>
                  </td>
                </tr>
              ))}
              {(!data.items || data.items.length === 0) && (
                <tr>
                  <td className="px-3 py-6 text-center text-white/50" colSpan={8}>
                    Sem dados ainda. Usa um dos botões de ingest acima para popular rapidamente (stubs prontos).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
