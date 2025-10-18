// app/(admin)/conta-admin/page.tsx
import { isAdminFromCookies } from '@/lib/authAdmin';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import LegacyAdminContent from '@/components/LegacyAdminContent';
export const dynamic = 'force-dynamic'; // garante leitura de cookies por request

export const metadata = {
  title: 'Admin · AI Finder',
};

export default function AdminPage() {
  const authed = isAdminFromCookies();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {authed ? (
        <>
          <h1 className="mb-4 text-2xl font-semibold text-white">Backoffice</h1>
          <LegacyAdminContent />
        </>
      ) : (
        <AdminLoginForm />
      )}
    </main>
  );
}
