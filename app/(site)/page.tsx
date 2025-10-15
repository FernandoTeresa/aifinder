// app/(site)/page.tsx
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import FeatureCards from '@/components/FeatureCards';
import HomeClient from './_components/HomeClient';

export default function HomePage() {
  return (
    <main className="relative min-h-[85vh]">
      {/* Hero e blocos leves renderizam no server */}
      <Hero />
      <TrustBar />
      <FeatureCards />

      {/* Blocos interativos/pesados (carregados no cliente) */}
      <HomeClient />
    </main>
  );
}