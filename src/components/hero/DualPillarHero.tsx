import Link from 'next/link';
import { ReactNode } from 'react';

import { Quote } from '@/types';

export interface HeroPillar {
  icon: ReactNode;
  label: string;
  headline: string;
  summary: string;
  scriptureLabel: string;
  scriptureText: string;
  reflection: string;
  ctaLabel: string;
  ctaHref: string;
  accent?: 'news' | 'action';
}

interface DualPillarHeroProps {
  kicker?: string;
  title: string;
  subtitle: string;
  heroQuote: Quote;
  left: HeroPillar;
  right: HeroPillar;
}

export function DualPillarHero({
  kicker = 'Wisdom → Action',
  title,
  subtitle,
  heroQuote,
  left,
  right,
}: DualPillarHeroProps) {
  return (
    <section className='relative overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-[#fff7ec] via-[#fff7f3] to-[#f6ede7] p-8 shadow-xl shadow-rose-100/50'>
      <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
        <div className='max-w-xl'>
          <p className='text-xs font-semibold uppercase tracking-[0.4em] text-red-600'>
            {kicker}
          </p>
          <h1 className='mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl'>
            {title}
          </h1>
          <p className='mt-4 text-base text-neutral-700 md:text-lg'>
            {subtitle}
          </p>
        </div>
        <div className='max-w-sm rounded-2xl border border-red-200 bg-[#ffffff] p-5 text-sm text-neutral-700 shadow-inner'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500'>
            Featured Word
          </p>
          <p className='mt-3 text-lg font-semibold text-red-600'>
            "{heroQuote.text}"
          </p>
          <p className='mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500'>
            {heroQuote.reference}
          </p>
          <p className='mt-3 text-neutral-600'>
            Carry this word into every headline, workplace, and neighborhood
            interaction today.
          </p>
        </div>
      </div>

      <div className='mt-8 grid gap-4 md:grid-cols-2'>
        {[left, right].map((pillar) => (
          <article
            key={pillar.label}
            className={`flex flex-col rounded-2xl border p-5 transition hover:-translate-y-1 ${
              pillar.accent === 'news'
                ? 'border-amber-200 bg-white/70'
                : 'border-green-200 bg-green-50/70'
            }`}
          >
            <div className='flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]'>
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                  pillar.accent === 'news'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {pillar.icon}
              </span>
              <span className='text-neutral-600'>{pillar.label}</span>
            </div>
            <h3 className='mt-4 text-xl font-semibold text-neutral-900'>
              {pillar.headline}
            </h3>
            <p className='mt-2 text-sm text-neutral-700'>{pillar.summary}</p>
            <div className='mt-4 flex-grow rounded-xl bg-[#ffffff] p-4 text-sm text-neutral-700'>
              <p className='text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-neutral-500'>
                {pillar.scriptureLabel}
              </p>
              <p className='mt-2 font-medium !text-red-600'>
                {pillar.scriptureText}
              </p>
              <p className='mt-2 text-neutral-600'>{pillar.reflection}</p>
            </div>
            <Link
              href={pillar.ctaHref}
              className={`mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                pillar.accent === 'news'
                  ? 'border-2 border-amber-600 bg-amber-600 text-white hover:bg-amber-700 hover:border-amber-700'
                  : 'bg-green-700 text-white shadow-lg shadow-green-500/40 hover:-translate-y-0.5'
              }`}
            >
              {pillar.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
