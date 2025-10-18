// app/(admin)/conta-admin/page.tsx
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

// Se já tens este helper em '@/lib/adminAuth', usa-o.
// Aqui fica um fallback simples que valida cookie ou bearer:
async function assertAdmin() {
  const h = await headers();
  const token =
    (await cookies()).get('admin_token')?.value ||
    h.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    redirect('/'); // ou redireciona para uma página de login se preferires
  }
}

export default async function AdminDashboardPage() {
  await assertAdmin();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-white/70">
          Bem-vindo à área de administração. Usa a navegação para gerir o catálogo de IAs, fazer ingest de dados e
          acompanhar métricas.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Modelos ativos" value="—" />
          <StatCard label="Fontes sincronizadas" value="—" />
          <StatCard label="Atualizações últimas 24h" value="—" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Ações rápidas</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/conta-admin/ia"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:border-white/20 hover:text-white"
          >
            Abrir Gestão de IAs
          </a>
          <form action="/api/admin/logout" method="post">
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:border-red-400/30 hover:text-red-200"
              type="submit"
            >
              Terminar sessão admin
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
