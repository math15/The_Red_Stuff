'use client';

import {
  ArrowUpRight,
  CheckCircle,
  Clock8,
  Flame,
  MapPin,
  MessageSquareQuote,
} from 'lucide-react';
import Link from 'next/link';

import { UserActionsService } from '@/lib/user-actions.client';

import { Opportunity, Quote as QuoteType } from '@/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  quote?: QuoteType;
  showUrgency?: boolean;
}

const urgencyConfig: Record<string, string> = {
  immediate: 'bg-red-100 text-red-700 border-red-300',
  seasonal: 'bg-amber-100 text-amber-700 border-amber-200',
  ongoing: 'bg-green-100 text-green-700 border-green-200',
};

export function OpportunityCard({
  opportunity,
  quote,
  showUrgency = true,
}: OpportunityCardProps) {
  const locationLabel =
    opportunity.location.mode === 'remote'
      ? 'Remote'
      : [opportunity.location.city, opportunity.location.state]
          .filter(Boolean)
          .join(', ');

  const handleClick = () => {
    UserActionsService.trackOpportunityClick(opportunity.id);
  };

  return (
    <article className='flex h-full flex-col rounded-2xl border border-rose-200 bg-[#ffffff] p-5 shadow-sm shadow-rose-100/70 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-200/70'>
      <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-600'>
        <span className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600'>
          <Flame className='h-4 w-4' />
        </span>
        {opportunity.organization_name}
      </div>
      <div className='mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-600'>
        <span className='inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1'>
          <Clock8 className='h-3.5 w-3.5 text-red-500' />
          {opportunity.time_commitment.replace('-', ' ')}
        </span>
        <span className='inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1'>
          <MapPin className='h-3.5 w-3.5 text-green-600' />
          {locationLabel}
        </span>
        {showUrgency ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
              urgencyConfig[opportunity.urgency_level] ??
              'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            <Flame className='h-3.5 w-3.5' />
            {opportunity.urgency_level === 'immediate'
              ? 'Urgent'
              : opportunity.urgency_level}
          </span>
        ) : null}
      </div>

      <div className='mt-4 flex flex-1 flex-col'>
        <div>
          <h3 className='text-xl font-semibold text-neutral-900'>
            {opportunity.opportunity_title}
          </h3>
          <p className='mt-2 text-sm text-neutral-700'>
            {opportunity.description}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2 text-xs font-semibold text-neutral-600'>
          {opportunity.cause_categories.map((category) => (
            <span
              key={category}
              className='rounded-full bg-neutral-100 px-3 py-1 text-neutral-600'
            >
              {category}
            </span>
          ))}
        </div>

        {quote ? (
          <div className='mt-auto pt-4'>
            <div className='flex min-h-[148px] flex-col rounded-xl border border-red-100 bg-[#ffffff] p-4 text-sm text-neutral-700'>
              <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-600'>
                <MessageSquareQuote className='h-3.5 w-3.5 text-neutral-500' />
                Related Word
              </div>
              <p className='mt-2 flex-1 font-medium !text-red-600'>
                "{quote.text}"
              </p>
              <p className='mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500'>
                {quote.reference}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className='mt-4 flex flex-wrap gap-3 text-sm font-semibold'>
        <Link
          href={`/opportunities/${opportunity.id}`}
          onClick={handleClick}
          className='inline-flex grow items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50'
        >
          Learn More
        </Link>
        {opportunity.application_url ? (
          <Link
            href={opportunity.application_url}
            onClick={handleClick}
            target='_blank'
            rel='noreferrer'
            className='inline-flex grow items-center justify-center gap-2 rounded-full bg-green-700 px-4 py-2 text-white shadow-lg shadow-green-500/40 transition hover:-translate-y-0.5 hover:bg-green-600'
          >
            <CheckCircle className='h-4 w-4' />
            Get Involved
          </Link>
        ) : (
          <Link
            href={`/opportunities/${opportunity.id}?intent=interested`}
            onClick={handleClick}
            className='inline-flex grow items-center justify-center gap-2 rounded-full bg-green-700 px-4 py-2 text-white shadow-lg shadow-green-500/40 transition hover:-translate-y-0.5 hover:bg-green-600'
          >
            <ArrowUpRight className='h-4 w-4' />
            Get Involved
          </Link>
        )}
      </div>
    </article>
  );
}
