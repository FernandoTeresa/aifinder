'use client';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from './cn';

type PolymorphicProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = 'button'>({ as, className, ...props }: PolymorphicProps<T>) {
  const Comp = (as ?? 'button') as ElementType;
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight text-white transition',
        'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 shadow-[0_24px_45px_-25px_rgba(56,189,248,0.85)]',
        'hover:from-sky-400 hover:via-blue-400 hover:to-indigo-500 hover:shadow-[0_28px_55px_-28px_rgba(56,189,248,0.95)] active:scale-[0.99]',
        className
      )}
      {...props}
    />
  );
}

export function GhostButton<T extends ElementType = 'button'>({ as, className, ...props }: PolymorphicProps<T>) {
  const Comp = (as ?? 'button') as ElementType;
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition',
        'hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-[0.99]',
        className
      )}
      {...props}
    />
  );
}
