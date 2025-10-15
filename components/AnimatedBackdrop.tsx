'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(56,189,248,0.18),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_15%_80%,rgba(129,140,248,0.12),transparent_65%)]" />

      <motion.div
        className="absolute -top-40 right-[-12rem] h-[34rem] w-[34rem] rounded-full blur-[140px]"
        style={{
          background: 'conic-gradient(from 140deg at 50% 50%, rgba(14,165,233,0.55), rgba(129,140,248,0.4), rgba(56,189,248,0.55))',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute -bottom-32 left-[-14rem] h-[30rem] w-[30rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.4), transparent 65%)' }}
        animate={{ x: [0, 18, 0], y: [0, -24, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-40"
        style={{ boxShadow: '0 0 140px -40px rgba(56,189,248,0.4) inset' }}
        animate={{ rotate: [0, 8, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
