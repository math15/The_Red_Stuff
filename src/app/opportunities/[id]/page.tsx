import { MapPinned, ShieldCheck, Timer } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  filterOpportunities,
  getOpportunityById,
  getQuotesForOpportunity,
} from '@/lib/opportunity-service';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { OpportunityInterestForm } from '@/components/opportunities/InterestForm';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { ShareOpportunityButton } from '@/components/opportunities/ShareButton';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface OpportunityPageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityPage({
  params,
}: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const relatedQuotes = await getQuotesForOpportunity(opportunity);
  const similarOpportunities = (
    await filterOpportunities({
      cause: opportunity.cause_categories,
      limit: 3,
    })
  ).filter((item) => item.id !== opportunity.id);

  const similarWithQuotes = await Promise.all(
    similarOpportunities.map(async (item) => ({
      opportunity: item,
      quote: (await getQuotesForOpportunity(item))[0],
    }))
  );

  const locationLabel =
    opportunity.location.mode === 'remote'
      ? 'Remote / Virtual'
      : [opportunity.location.city, opportunity.location.state]
          .filter(Boolean)
          .join(', ');

  return (
    <div className='mx-auto w-[92%] max-w-6xl space-y-10 pb-16'>
      <PageViewTracker
        pageName='opportunity_detail'
        metadata={{
          opportunityId: opportunity.id,
          title: opportunity.opportunity_title,
        }}
      />
      <section className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-8 shadow-lg shadow-rose-100/70'>
        <div className='flex flex-col gap-6 md:flex-row md:justify-between'>
          <div className='space-y-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
              {opportunity.organization_name}
            </p>
            <h1 className='text-3xl font-semibold text-neutral-900 md:text-4xl'>
              {opportunity.opportunity_title}
            </h1>
            <p className='text-base text-neutral-700 md:text-lg'>
              {opportunity.description}
            </p>
            <div className='flex flex-wrap gap-3 text-xs font-semibold text-neutral-600'>
              <span className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2'>
                <Timer className='h-4 w-4 text-neutral-700' />
                {opportunity.time_commitment}
              </span>
              <span className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2'>
                <MapPinned className='h-4 w-4 text-neutral-700' />
                {locationLabel}
              </span>
              <span className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 capitalize'>
                <ShieldCheck className='h-4 w-4 text-neutral-700' />
                {opportunity.urgency_level} need
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            {opportunity.application_url ? (
              <Link
                href={opportunity.application_url}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center justify-center rounded-full bg-neutral-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-500/40 transition hover:-translate-y-0.5'
              >
                Apply on partner site
              </Link>
            ) : null}
            <ShareOpportunityButton
              title={opportunity.opportunity_title}
              opportunityId={opportunity.id}
            />
          </div>
        </div>

        {opportunity.highlight_reason ? (
          <div className='mt-6 rounded-2xl border border-neutral-200 bg-[#ffffff] p-4 text-sm text-neutral-700'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
              Why this matters now
            </p>
            <p className='mt-1 text-neutral-800'>
              {opportunity.highlight_reason}
            </p>
          </div>
        ) : null}
      </section>

      <div className='grid gap-6 md:grid-cols-[2fr,1fr]'>
        <div className='space-y-6'>
          <div className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-6 text-sm text-neutral-700'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
              Overview
            </p>
            <p className='mt-3 text-neutral-700'>{opportunity.description}</p>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500'>
                  Skills needed
                </p>
                <ul className='mt-2 space-y-1'>
                  {opportunity.skills_needed.map((skill) => (
                    <li
                      key={skill}
                      className='rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700'
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500'>
                  Cause areas
                </p>
                <ul className='mt-2 space-y-1'>
                  {opportunity.cause_categories.map((cause) => (
                    <li
                      key={cause}
                      className='rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700'
                    >
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-6 text-sm text-neutral-700'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
              Time & location
            </p>
            <div className='mt-3 grid gap-4 md:grid-cols-2'>
              <div>
                <p className='font-semibold text-neutral-900'>Commitment</p>
                <p className='text-sm text-neutral-600'>
                  {opportunity.time_commitment} • {opportunity.urgency_level}{' '}
                  response
                </p>
              </div>
              <div>
                <p className='font-semibold text-neutral-900'>Location</p>
                <p className='text-sm text-neutral-600'>
                  {locationLabel}
                  {opportunity.location.mode === 'remote'
                    ? ' • Serve from anywhere'
                    : ''}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='font-semibold text-neutral-900'>Point of contact</p>
              <p className='text-sm text-neutral-600'>
                {opportunity.contact_info.email ? (
                  <a
                    href={`mailto:${opportunity.contact_info.email}`}
                    className='text-neutral-700 underline'
                  >
                    {opportunity.contact_info.email}
                  </a>
                ) : (
                  'Pending introduction'
                )}
              </p>
              {opportunity.contact_info.phone ? (
                <p className='text-sm text-neutral-600'>
                  Phone:{' '}
                  <a href={`tel:${opportunity.contact_info.phone}`}>
                    {opportunity.contact_info.phone}
                  </a>
                </p>
              ) : null}
              {opportunity.contact_info.instructions ? (
                <p className='mt-2 text-sm text-neutral-600'>
                  {opportunity.contact_info.instructions}
                </p>
              ) : null}
            </div>
          </div>

          <div className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-6 text-sm text-neutral-700'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
              Scripture alignment
            </p>
            <div className='mt-3 grid gap-4 md:grid-cols-2'>
              {relatedQuotes.map((quote) => (
                <article
                  key={quote.id}
                  className='rounded-2xl border border-neutral-200 bg-[#ffffff] p-4'
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500'>
                    {quote.reference}
                  </p>
                  <p className='mt-2 text-base font-semibold text-red-600'>
                    "{quote.text}"
                  </p>
                  {quote.context ? (
                    <p className='mt-1 text-xs text-neutral-500'>
                      {quote.context}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <OpportunityInterestForm
            opportunityId={opportunity.id}
            applicationUrl={opportunity.application_url}
          />
          <div className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-6 text-sm text-neutral-700'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
              Checklist
            </p>
            <ul className='mt-3 space-y-2'>
              {[
                'Orientation completed online',
                'Background check (if mentoring)',
                'Willingness to pray with neighbors',
              ].map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className='mt-1 inline-block h-2 w-2 rounded-full bg-neutral-700' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {similarWithQuotes.length > 0 ? (
        <>
          <SectionHeader
            kicker='Similar opportunities'
            title='Stay in the same stream of impact'
            description='If this slot fills, choose another aligned opportunity below.'
          />
          <div className='grid gap-6 md:grid-cols-3'>
            {similarWithQuotes.map(({ opportunity: item, quote }) => (
              <OpportunityCard key={item.id} opportunity={item} quote={quote} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
