import { Flame, HandHeart, MapPinned, Navigation } from 'lucide-react';
import Link from 'next/link';

import { loadCurrentEvents, loadQuotes } from '@/lib/data-sources';
import {
  FilteredOpportunityOptions,
  filterOpportunities,
  getFeaturedOpportunities,
  getOpportunitiesMatchingEvent,
  getQuotesForOpportunity,
} from '@/lib/opportunity-service';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { GoodWorksExplorer } from '@/components/opportunities/GoodWorksExplorer';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

import {
  CauseCategory,
  OpportunityLocationMode,
  Quote,
  TimeCommitment,
  UrgencyLevel,
} from '@/types';

interface GoodWorksPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const toArray = (value?: string | string[]) => {
  if (!value) return undefined;
  return Array.isArray(value)
    ? value
    : value.split(',').map((item) => item.trim());
};

const buildFilterOptions = (
  filters: ReturnType<typeof parseFilters>
): FilteredOpportunityOptions => {
  const causeValue = filters.cause;
  let cause: CauseCategory | CauseCategory[] | 'all' | undefined = undefined;
  if (causeValue && causeValue !== 'all') {
    cause = causeValue.includes(',')
      ? (causeValue.split(',').map((value) => value.trim()) as CauseCategory[])
      : (causeValue as CauseCategory);
  }

  return {
    location: filters.location || undefined,
    cause,
    timeCommitment:
      filters.timeCommitment && filters.timeCommitment !== 'any'
        ? (filters.timeCommitment as TimeCommitment)
        : undefined,
    mode:
      filters.mode && filters.mode !== 'any'
        ? (filters.mode as OpportunityLocationMode)
        : undefined,
    urgency:
      filters.urgency && filters.urgency !== 'any'
        ? (filters.urgency as UrgencyLevel)
        : undefined,
    skills: filters.skills.length > 0 ? filters.skills : undefined,
    search: filters.search || undefined,
    limit: 8,
  };
};

const parseFilters = (
  searchParams: Record<string, string | string[] | undefined>
) => {
  const getParam = (key: string) => {
    const value = searchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const skills = toArray(getParam('skills')) ?? [];

  return {
    location: getParam('location') ?? '',
    cause: getParam('category') ?? 'all',
    timeCommitment: getParam('timeCommitment') ?? 'any',
    mode: getParam('mode') ?? 'any',
    urgency: getParam('urgency') ?? 'any',
    skills,
    search: getParam('search') ?? '',
  };
};

export default async function GoodWorksPage({
  searchParams,
}: GoodWorksPageProps) {
  const resolvedSearchParams = await searchParams;
  const quotesData = await loadQuotes();
  const heroQuote: Quote =
    quotesData.find((quote) => quote.id === 'quote-matthew-7-16') ??
    quotesData[0];
  const filters = parseFilters(resolvedSearchParams);
  const filterOptions = buildFilterOptions(filters);
  const initialResults = await filterOpportunities(filterOptions);

  const urgentOpportunities = await getFeaturedOpportunities(3);
  const currentEvents = await loadCurrentEvents();

  const eventParam = resolvedSearchParams.event;
  const eventId =
    (Array.isArray(eventParam) ? eventParam[0] : eventParam) ?? '';
  const selectedEvent = currentEvents.find((event) => event.id === eventId);
  const eventMatches = selectedEvent
    ? (await getOpportunitiesMatchingEvent(selectedEvent.id)).slice(0, 3)
    : [];

  const urgentWithQuotes = await Promise.all(
    urgentOpportunities.map(async (opportunity) => ({
      opportunity,
      quote: (await getQuotesForOpportunity(opportunity))[0],
    }))
  );
  const urgentCount = urgentWithQuotes.length;

  const eventMatchWithQuotes = await Promise.all(
    eventMatches.map(async (opportunity) => ({
      opportunity,
      quote: (await getQuotesForOpportunity(opportunity))[0],
    }))
  );

  return (
    <div className='space-y-10 pb-20'>
      <PageViewTracker
        pageName='good_works'
        metadata={{ hasFilters: Object.keys(resolvedSearchParams).length > 0 }}
      />
      <section className='rounded-3xl border border-rose-200 bg-gradient-to-br from-[#fff7ed] via-white to-[#f6f1eb] p-8 shadow-xl shadow-rose-100/70'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.4em] text-red-600'>
              Matthew 7:16
            </p>
            <h1 className='mt-4 text-3xl font-semibold text-neutral-900 md:text-4xl'>
              “By their fruits you will know them.”
            </h1>
            <p className='mt-4 text-base text-neutral-700 md:text-lg'>
              This page is a living response to Jesus’ words. Every opportunity
              is curated, verified, and linked to Scripture so that reflection
              naturally becomes action.
            </p>
            <blockquote className='mt-4 rounded-2xl border border-rose-200 bg-white/80 p-4 text-sm text-neutral-700'>
              <p className='text-lg font-semibold text-neutral-900'>
                “{heroQuote.text}”
              </p>
              <p className='mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-600'>
                {heroQuote.reference}
              </p>
            </blockquote>
            <div className='mt-6 flex flex-wrap gap-3 text-xs font-semibold text-neutral-600'>
              <span className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2'>
                <Flame className='h-4 w-4 text-red-500' />
                {urgentCount} urgent this week
              </span>
              <span className='inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2'>
                <MapPinned className='h-4 w-4 text-green-600' />
                Remote + local options
              </span>
              <span className='inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2'>
                <HandHeart className='h-4 w-4 text-amber-600' />
                Manual verification & partner vetting
              </span>
            </div>
          </div>
          <div className='rounded-2xl border border-rose-100 bg-white/80 p-5 text-sm text-neutral-700 shadow-inner'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
              How it works
            </p>
            <ul className='mt-3 space-y-3'>
              {[
                'Tell us your city, capacity, and skills.',
                'We surface opportunities connected to today’s headlines or your saved quotes.',
                'Each card shows the Scripture it fulfills + an “I’m interested” action.',
              ].map((item) => (
                <li
                  key={item}
                  className='flex items-start gap-3 text-sm text-neutral-700'
                >
                  <span className='mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[0.7rem] font-semibold text-red-600'>
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {selectedEvent ? (
              <div className='mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.35em] text-amber-700'>
                  Spotlighted headline
                </p>
                <p className='mt-2 text-sm font-semibold text-neutral-900'>
                  {selectedEvent.headline}
                </p>
                <p className='mt-1 text-xs text-neutral-600'>
                  {selectedEvent.summary}
                </p>
                <p className='mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700'>
                  Recommended matches
                </p>
                <p className='text-sm text-neutral-700'>
                  {eventMatchWithQuotes.length > 0
                    ? 'We highlighted three opportunities aligned with this story.'
                    : 'Browse below to connect this headline with faithful action.'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <SectionHeader
        kicker='Live filters'
        title='Discover opportunities that fit your life'
        description='Filter by location, cause, time, skills, or urgency. Use your device location for instant matching.'
      />
      <GoodWorksExplorer
        initialFilters={filters}
        initialResults={initialResults}
      />

      {eventMatchWithQuotes.length > 0 ? (
        <>
          <SectionHeader
            kicker='Match results'
            title='Direct responses to the highlighted headline'
            description='Rooted in lament, accelerated into hope-filled work.'
          />
          <div className='grid gap-6 md:grid-cols-2'>
            {eventMatchWithQuotes.map(({ opportunity, quote }) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                quote={quote}
              />
            ))}
          </div>
        </>
      ) : null}

      <SectionHeader
        kicker='Urgent'
        title='Opportunities needing immediate response'
        description='Signal boost for ministries filling critical gaps within 72 hours.'
      />
      <div className='grid gap-6 md:grid-cols-3'>
        {urgentWithQuotes.map(({ opportunity, quote }) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            quote={quote}
          />
        ))}
      </div>

      <div className='rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-sm text-neutral-700'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700'>
              Prefer a guided introduction?
            </p>
            <p className='mt-2 text-lg font-semibold text-neutral-900'>
              Book a 15-minute matching session with our pastoral concierge.
            </p>
            <p className='mt-1 text-neutral-700'>
              We’ll pray with you, suggest three options, and text reminders
              leading up to your shift.
            </p>
          </div>
          <Link
            href='/good-works/concierge'
            className='inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/40 transition hover:-translate-y-0.5'
          >
            <Navigation className='h-4 w-4' />
            Book a matching call
          </Link>
        </div>
      </div>
    </div>
  );
}
