import {
  BookOpenCheck,
  BrainCircuit,
  HandHeart,
  Megaphone,
  Newspaper,
  Star,
  Store,
} from 'lucide-react';
import Link from 'next/link';

import { loadCurrentEvents, loadQuotes } from '@/lib/data-sources';
import {
  getFeaturedOpportunities,
  getQuotesForOpportunity,
} from '@/lib/opportunity-service';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { DualPillarHero } from '@/components/hero/DualPillarHero';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { RecommendationsPanel } from '@/components/opportunities/RecommendationsPanel';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { ActionFlowCard } from '@/components/ui/ActionFlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';

import { Quote } from '@/types';

export default async function HomePage() {
  const currentEvents = await loadCurrentEvents();
  const featuredEvent = currentEvents[0];
  const quotesData = await loadQuotes();
  const featuredOpportunities = await getFeaturedOpportunities(4);
  const actionOpportunity = featuredOpportunities[0];

  const heroQuote: Quote =
    quotesData.find(
      (quote) => quote.id === featuredEvent?.related_quote_ids[0]
    ) ?? quotesData[0];

  const actionQuote = actionOpportunity
    ? (await getQuotesForOpportunity(actionOpportunity))[0] ?? heroQuote
    : heroQuote;

  const featuredCards = await Promise.all(
    featuredOpportunities.map(async (opportunity) => ({
      opportunity,
      quote: (await getQuotesForOpportunity(opportunity))[0],
    }))
  );

  const hero = featuredEvent ? (
    <DualPillarHero
      title='The direct words of Jesus Christ, applied to today’s world, activated through your actions.'
      subtitle='Each headline has a corresponding act of mercy. Each question can become a mission.'
      heroQuote={heroQuote}
      left={{
        icon: <Newspaper className='h-5 w-5' />,
        label: "Today's World",
        headline: featuredEvent.headline,
        summary: featuredEvent.summary,
        scriptureLabel: 'Matched wisdom',
        scriptureText: heroQuote.text,
        reflection:
          'Do not turn away—bring this ache before Christ and ask how to respond.',
        ctaLabel: 'View current events',
        ctaHref: `/good-works?event=${featuredEvent.id}`,
        accent: 'news',
      }}
      right={{
        icon: <HandHeart className='h-5 w-5' />,
        label: 'Your Actions',
        headline: actionOpportunity?.opportunity_title ?? 'Featured good work',
        summary:
          actionOpportunity?.highlight_reason ??
          'Discover a verified opportunity that transforms lament into love.',
        scriptureLabel: actionQuote.reference,
        scriptureText: actionQuote.text,
        reflection:
          'Say yes within 5 minutes—courage grows when we act quickly.',
        ctaLabel: 'Step into the work',
        ctaHref: actionOpportunity
          ? `/opportunities/${actionOpportunity.id}`
          : '/good-works',
        accent: 'action',
      }}
    />
  ) : null;

  const actionFlowSteps = [
    {
      id: 'news',
      icon: <Newspaper className='h-5 w-5' />,
      label: 'News',
      title: featuredEvent?.headline ?? 'Listen to the city',
      description:
        featuredEvent?.summary ??
        'We scan today’s headlines, trauma, and hope-filled breakthroughs.',
      ctaLabel: 'See context',
      ctaHref: `/good-works?event=${featuredEvent?.id ?? ''}`,
    },
    {
      id: 'quote',
      icon: <BookOpenCheck className='h-5 w-5' />,
      label: 'Word of Wisdom',
      title: heroQuote.reference,
      description: heroQuote.text,
      ctaLabel: 'Browse quotes',
      ctaHref: '/quotations',
    },
    {
      id: 'action',
      icon: <HandHeart className='h-5 w-5' />,
      label: 'Action',
      title:
        actionOpportunity?.opportunity_title ?? 'Take the next faithful step',
      description:
        actionOpportunity?.description ??
        'Find a verified volunteer opportunity or micro-action to start within days.',
      ctaLabel: 'Find good works',
      ctaHref: actionOpportunity
        ? `/opportunities/${actionOpportunity.id}`
        : '/good-works',
    },
  ];

  const secondaryFeatures = [
    {
      title: 'Ask a Question',
      description:
        'Bring your burden, fear, or confusion. Receive a scripture-grounded response.',
      href: '/ask',
      icon: <BrainCircuit className='h-5 w-5 text-red-600' />,
    },
    {
      title: 'Browse Quotations',
      description:
        'Meditate on every word Jesus speaks. Filter by theme, crisis, or longing.',
      href: '/quotations',
      icon: <BookOpenCheck className='h-5 w-5 text-red-600' />,
    },
    {
      title: 'Visit Store',
      description:
        'Wear reminders of mercy. Profits fuel emergency response grants.',
      href: '/store',
      icon: <Store className='h-5 w-5 text-red-600' />,
    },
    {
      title: 'About The Red Stuff',
      description:
        'Meet the prayerful technologists, pastors, and neighbors building this ecosystem.',
      href: '/about',
      icon: <Megaphone className='h-5 w-5 text-red-600' />,
    },
  ];

  return (
    <div className='space-y-12 pb-16'>
      <PageViewTracker pageName='home' />
      {hero}
      <div className='mt-4 flex flex-wrap gap-3 text-sm font-semibold'>
        <Link
          href='/quotations'
          className='inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2 text-red-600 transition hover:border-red-400 hover:text-red-700'
        >
          View more daily quotes →
        </Link>
        <Link
          href='/good-works'
          className='inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-green-700 transition hover:border-green-400 hover:text-green-800'
        >
          Find more opportunities →
        </Link>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <StatCard
          label='Word to Action conversions'
          value='48%'
          helper='Users who click an action within 3 minutes of reading a quote.'
          tone='red'
        />
        <StatCard
          label='Verified opportunities live'
          value='312'
          helper='Across hunger, housing, youth, justice, and creation care.'
          tone='green'
        />
        <StatCard
          label='Urgent needs this week'
          value='27'
          helper='Meals, transitional housing, legal aid, and remote care.'
          tone='amber'
        />
      </div>

      <SectionHeader
        kicker='Flow 01'
        title='News → Wisdom → Action'
        description='Every session elevates one relevant story, a piercing quote from Jesus, and a tangible next step.'
      />
      <ActionFlowCard steps={actionFlowSteps} />

      <SectionHeader
        kicker='Featured Good Works'
        title='By Their Fruits: urgent & high-impact opportunities'
        description='Curated weekly with partners like United Way, hospital chaplain networks, and grassroots ministries.'
      />

      <div className='grid gap-6 md:grid-cols-2'>
        {featuredCards.map(({ opportunity, quote }) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            quote={quote}
          />
        ))}
      </div>

      <div className='rounded-3xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-neutral-700'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-amber-700'>
          Success snapshot
        </p>
        <div className='mt-3 grid gap-4 md:grid-cols-3'>
          {[
            {
              title: 'Meals cooked',
              value: '1,420',
              detail: 'Across Chicago & Oakland shelters',
            },
            {
              title: 'Youth mentored this month',
              value: '268',
              detail: 'Through BrightSteps + Peace Circles',
            },
            {
              title: 'Letters to incarcerated neighbors',
              value: '780',
              detail: 'Second Chance Correspondence',
            },
          ].map((item) => (
            <div key={item.title}>
              <p className='text-sm font-semibold text-neutral-800'>
                {item.title}
              </p>
              <p className='text-2xl font-bold text-amber-700'>{item.value}</p>
              <p className='text-xs text-neutral-600'>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader
        kicker='Daily Wisdom'
        title='Matched Words of Jesus'
        description='Meditate on today’s guiding Scriptures. Save them, share them, act on them.'
      />

      <div className='grid gap-4 md:grid-cols-3'>
        {quotesData.slice(0, 3).map((quote, index) => (
          <QuoteCard key={quote.id} quote={quote} highlight={index === 0} />
        ))}
      </div>

      <SectionHeader
        kicker='Personalized Path'
        title='Recommendations based on your focus'
        description='Adjust cause, skills, or city to see opportunities that align with your prayers and availability.'
      />
      <RecommendationsPanel />

      <SectionHeader
        kicker='Choose your next step'
        title='Secondary features'
        description='Everything is designed to move hearts from overwhelm to faithful impact.'
      />
      <div className='grid gap-4 md:grid-cols-2'>
        {secondaryFeatures.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className='rounded-2xl border border-rose-200 bg-white/90 p-5 text-sm text-neutral-700 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-200/80'
          >
            <div className='flex items-center gap-3'>
              <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600'>
                {feature.icon}
              </span>
              <div>
                <p className='text-base font-semibold text-neutral-900'>
                  {feature.title}
                </p>
                <p>{feature.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <SectionHeader
        kicker='Stories of Transformation'
        title='“By their fruits you will know them.”'
        description='Readers becoming restorers in their own neighborhoods.'
      />
      <div className='grid gap-4 md:grid-cols-2'>
        {[
          {
            quote:
              '“I read Matthew 25 in the app on my commute. By lunch I had joined a shelter team. 48 hours later we were serving chili to women who slept warm for the first time in weeks.”',
            name: 'Lauren · Chicago',
          },
          {
            quote:
              '“News about rising evictions crushed me daily. The Red Stuff matched me to legal clinics two train stops away. Now I see faces instead of headlines.”',
            name: 'Marcus · NYC',
          },
        ].map((story) => (
          <article
            key={story.name}
            className='rounded-2xl border border-rose-200 bg-gradient-to-br from-white to-rose-50 p-5 text-neutral-700 shadow-sm'
          >
            <Star className='h-6 w-6 text-amber-500' />
            <p className='mt-3 text-lg font-medium text-neutral-900'>
              {story.quote}
            </p>
            <p className='mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500'>
              {story.name}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
