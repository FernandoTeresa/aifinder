'use client';
import dynamic from 'next/dynamic';
import UseCasesCarousel from '@/components/UseCasesCarousel';

const RankTable = dynamic(() => import('@/components/RankTable'), {
  loading: () => (
    <div className="mx-auto max-w-6xl px-4 py-14 text-sm opacity-60">
      A carregar ranking…
    </div>
  ),
});

export default function HomeClient() {
  return (
    <>
      <UseCasesCarousel />
      <RankTable />
    </>
  );
}