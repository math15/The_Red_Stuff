import Link from 'next/link';
import { ReactNode } from 'react';

interface FlowStep {
  id: string;
  icon: ReactNode;
  label: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface ActionFlowCardProps {
  steps: FlowStep[];
}

export function ActionFlowCard({ steps }: ActionFlowCardProps) {
  return (
    <div className='rounded-3xl border border-rose-200 bg-[#ffffff] p-5 shadow-xl shadow-rose-100/60'>
      <div className='grid gap-4 md:grid-cols-3'>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className='relative flex h-full flex-col rounded-2xl border border-rose-100 bg-white p-4 text-sm text-neutral-700'
          >
            {index < steps.length - 1 ? (
              <div className='absolute inset-y-0 right-[-12px] hidden w-px bg-gradient-to-b from-red-200 to-transparent md:block' />
            ) : null}
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500'>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600'>
                {step.icon}
              </span>
              {step.label}
            </div>
            <div className='mt-3 flex flex-1 flex-col'>
              <h3 className='text-base font-semibold text-neutral-900'>
                {step.title}
              </h3>
              <p className='mt-1 text-sm text-neutral-600'>
                {step.description}
              </p>
            </div>
            {step.ctaHref && step.ctaLabel ? (
              <Link
                href={step.ctaHref}
                className='mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-red-600'
              >
                {step.ctaLabel} →
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
