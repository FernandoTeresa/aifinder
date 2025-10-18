import { cookies, headers } from 'next/headers';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { adminCookieName } from '@/lib/authAdmin';

export const metadata = {
  title: 'Admin · AI Finder',
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value || null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {!token ? (
        <>
          <h1 className="mb-4 text-2xl font-semibold">Entrar no painel</h1>
          <AdminLoginForm />
        </>
      ) : (
        <>
          <h1 className="mb-4 text-2xl font-semibold">Catálogo de IAs</h1>
          {/* aqui entram os teus componentes/CRUD */}
          <p className="text-white/70">Autenticado. Em breve: CRUD do catálogo.</p>
        </>
      )}
    </main>
  );
}