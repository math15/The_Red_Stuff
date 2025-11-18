import { BookOpenCheck, BrainCircuit, Store } from 'lucide-react';
import Link from 'next/link';

import { loadCurrentEvents, loadQuotes } from '@/lib/data-sources';
import {
  matchEventToQuotesForHome,
  matchOpportunityToQuoteForHome,
} from '@/lib/news-matcher';
import { getFeaturedOpportunities } from '@/lib/opportunity-service';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';

import { Quote } from '@/types';

export default async function HomePage() {
  const currentEvents = await loadCurrentEvents();
  const quotesData = await loadQuotes();
  const featuredOpportunities = await getFeaturedOpportunities(3);

  // Get today's word - quote matched to current event
  // John 16:33 quotes - find or create fallback
  const john1633Quotes = quotesData.filter((q) =>
    q.reference.includes('John 16:33')
  );
  const john1633Part1 =
    john1633Quotes.find((q) => q.text.toLowerCase().includes('trouble')) ??
    ({
      text: 'In this world you will have trouble…',
      reference: 'John 16:33',
      id: 'john-16-33-1',
      theme: 'hope' as const,
      tags: ['trouble', 'world'],
    } as Quote);

  const john1633Part2 =
    john1633Quotes.find((q) => q.text.toLowerCase().includes('overcome')) ??
    ({
      text: 'But take heart! I have overcome the world',
      reference: 'John 16:33',
      id: 'john-16-33-2',
      theme: 'hope' as const,
      tags: ['overcome', 'hope'],
    } as Quote);

  return (
    <div className='space-y-12 pb-16'>
      <PageViewTracker pageName='home' />

      {/* Main hero title */}
      <section className='mx-auto mt-4 w-[92%] max-w-6xl text-center'>
        <h1 className='text-4xl font-semibold text-neutral-900 md:text-5xl'>
          <span>The </span>
          <span className='text-red-600'>Red</span>
          <span> Stuff</span>
        </h1>
        <p className='mt-4 text-base text-neutral-700 md:text-lg'>
          Connecting today&apos;s headlines with Christ&apos;s red letter
          words—and turning wisdom into action
        </p>
      </section>

      {/* Today's Good Works - inspiring past stories of people who have made a difference */}
      <section className='mt-10 bg-[#f5f5f4] py-10'>
        <div className='mx-auto w-[92%] max-w-6xl px-4 md:px-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-neutral-900 md:text-3xl'>
              Today&apos;s Good Works
            </h2>
            <p className='mt-2 text-sm text-neutral-600 md:text-base'>
              Inspiring stories of people who have made a difference in their
              communities. These are real examples of past impact that show how
              faith becomes action.
            </p>
          </div>

          <div className='mt-8 grid gap-6 md:grid-cols-3 md:items-stretch'>
            {/* Placeholder success stories - to be replaced with actual stories */}
            {[
              {
                title:
                  'Local Teacher Starts Free After-School Tutoring Program',
                description:
                  'Sarah Martinez noticed struggling students in her neighborhood and started offering free tutoring in her garage. What began with 3 kids now serves 40 children weekly, helping them catch up and excel in school.',
                quote:
                  quotesData.find((q) => q.reference.includes('Matthew 25')) ??
                  quotesData[0],
              },
              {
                title: 'Community Garden Feeds 200 Families Monthly',
                description:
                  'When the local food bank faced shortages, retired nurse James Chen organized neighbors to transform an empty lot into a thriving community garden. Volunteers now harvest fresh produce that feeds over 200 families each month.',
                quote:
                  quotesData.find((q) => q.reference.includes('Matthew 5')) ??
                  quotesData[1],
              },
              {
                title: 'Teen Creates Care Packages for Homeless Neighbors',
                description:
                  'Sixteen-year-old Maya Patel started collecting hygiene items and warm clothing after seeing people in need near her school. Her initiative has now distributed over 500 care packages and inspired a city-wide youth movement.',
                quote:
                  quotesData.find((q) => q.reference.includes('Luke 10')) ??
                  quotesData[2],
              },
            ].map((story, index) => (
              <article
                key={index}
                className='flex flex-col rounded-3xl border border-neutral-200 bg-[#ffffff] p-6 shadow-md'
              >
                {/* Title section - fixed height */}
                <div className='flex-shrink-0 min-h-[72px] flex items-start'>
                  <h3 className='text-xl font-semibold text-neutral-900'>
                    {story.title}
                  </h3>
                </div>

                {/* Description section - fixed height */}
                <div className='mt-3 flex-shrink-0 min-h-[96px]'>
                  <p className='text-sm text-neutral-700'>
                    {story.description}
                  </p>
                </div>

                {/* Related Word section - fixed height */}
                {story.quote && (
                  <div className='mt-4 flex-shrink-0 min-h-[120px] border-t border-neutral-200 pt-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500'>
                      Related Word
                    </p>
                    <p className='mt-2 text-base font-medium text-red-600'>
                      &quot;{story.quote.text.substring(0, 100)}
                      {story.quote.text.length > 100 ? '...' : ''}&quot;
                    </p>
                    <p className='mt-1 text-xs font-medium text-neutral-500'>
                      — {story.quote.reference}
                    </p>
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div className='mt-6 flex-1' />

                {/* Button - links to full story (placeholder for now) */}
                <Link
                  href={`/stories/${index + 1}`}
                  className='mt-4 inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700'
                >
                  Learn More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Hear the Call / Heed the Call - side by side */}
      <section className='mx-auto grid w-[92%] max-w-6xl gap-6 md:grid-cols-2 md:items-stretch'>
        {/* Match quotes for both sections together to ensure no duplicates */}
        {await (async () => {
          // First, match quotes for "Hear the Call" section
          const usedQuoteIds: string[] = [];
          const hearTheCallResults = [];

          for (const event of currentEvents.slice(0, 3)) {
            const relatedQuote = await matchEventToQuotesForHome(
              event,
              quotesData,
              usedQuoteIds
            );
            if (relatedQuote) {
              usedQuoteIds.push(relatedQuote.id);
            }
            hearTheCallResults.push({ event, relatedQuote });
          }

          // Then, match quotes for "Heed the Call" section using the same usedQuoteIds
          const heedTheCallResults = [];

          for (const opportunity of featuredOpportunities.slice(0, 3)) {
            const quote = await matchOpportunityToQuoteForHome(
              opportunity,
              quotesData,
              usedQuoteIds
            );
            if (quote) {
              usedQuoteIds.push(quote.id);
            }
            heedTheCallResults.push({ opportunity, quote });
          }

          return { hearTheCallResults, heedTheCallResults };
        })().then(({ hearTheCallResults, heedTheCallResults }) => (
          <>
            {/* Hear the Call */}
            <div className='flex flex-col rounded-2xl border border-neutral-200 bg-[#ffffff] p-8 shadow-sm'>
              <div className='flex-shrink-0 min-h-[200px]'>
                <h2 className='text-2xl font-semibold text-neutral-900'>
                  Hear the Call
                </h2>
                <blockquote className='mt-4 border-l-4 border-red-600 pl-4'>
                  <p className='text-base font-medium !text-red-600'>
                    &quot;{john1633Part1.text}&quot;
                  </p>
                  <cite className='mt-1 block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500'>
                    — {john1633Part1.reference}
                  </cite>
                </blockquote>
                <p className='mt-4 text-sm text-neutral-700'>
                  Every day brings new challenges. Today&apos;s events,
                  illuminated by timeless wisdom to help you navigate them.
                </p>
              </div>

              {/* Simple list of 3 current events with matched quotes in red */}
              <div className='mt-6 flex flex-1 flex-col gap-4 text-sm text-neutral-800'>
                {hearTheCallResults.map(({ event, relatedQuote }) => (
                  <div
                    key={event.id}
                    className='flex flex-1 flex-col rounded-xl border-l-4 border-red-500 bg-[#ffffff] p-4 shadow-sm'
                  >
                    <p className='font-semibold text-neutral-900'>
                      {event.headline}
                    </p>
                    {relatedQuote && (
                      <>
                        <p className='mt-2 text-sm font-medium !text-red-600'>
                          &quot;{relatedQuote.text}&quot;
                        </p>
                        <p className='mt-0.5 text-xs text-neutral-500'>
                          — {relatedQuote.reference}
                        </p>
                      </>
                    )}
                    <div className='mt-auto pt-3'>
                      <Link
                        href={`/good-works?event=${event.id}`}
                        className='inline-flex items-center rounded-full bg-neutral-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-neutral-800'
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heed the Call */}
            <div className='flex flex-col rounded-2xl border border-neutral-200 bg-[#ffffff] p-8 shadow-sm'>
              <div className='flex-shrink-0 min-h-[200px]'>
                <h2 className='text-2xl font-semibold text-neutral-900'>
                  Heed the Call
                </h2>
                <blockquote className='mt-4 border-l-4 border-red-600 pl-4'>
                  <p className='text-base font-medium !text-red-600'>
                    &quot;{john1633Part2.text}&quot;
                  </p>
                  <cite className='mt-1 block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500'>
                    — {john1633Part2.reference}
                  </cite>
                </blockquote>
                <p className='mt-4 text-sm text-neutral-700'>
                  Take heart. The victory is already won. Now it&apos;s time to
                  step into the work—to feed the hungry, comfort the broken, and
                  be the hands and feet of Christ in your neighborhood.
                </p>
              </div>

              <div className='mt-6 flex flex-1 flex-col gap-4 text-sm text-neutral-800'>
                {heedTheCallResults.map(({ opportunity, quote }) => (
                  <Link
                    key={opportunity.id}
                    href={`/opportunities/${opportunity.id}`}
                    className='flex flex-1 flex-col rounded-xl border-l-4 border-red-500 bg-[#ffffff] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
                  >
                    <p className='text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500'>
                      {opportunity.organization_name}
                    </p>
                    <h3 className='mt-1 text-base font-semibold text-neutral-900'>
                      {opportunity.opportunity_title}
                    </h3>
                    <p className='mt-1 text-sm text-neutral-700'>
                      {opportunity.description.substring(0, 140)}...
                    </p>
                    {quote && (
                      <p className='mt-2 text-sm font-medium !text-red-600'>
                        &quot;{quote.text.substring(0, 80)}...&quot;
                      </p>
                    )}
                    <div className='mt-auto pt-3'>
                      <div className='inline-flex items-center rounded-full bg-neutral-700 px-3 py-1 text-xs font-semibold text-white'>
                        Take Action →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ))}
      </section>

      {/* Explore More - Bottom Navigation style section */}
      <section className='mt-10 bg-[#f5f5f4] py-10'>
        <div className='mx-auto w-[92%] max-w-6xl p-8'>
          <h2 className='mb-6 text-center text-2xl font-semibold text-neutral-900'>
            Explore More
          </h2>
          <div className='grid gap-4 md:grid-cols-3'>
            <Link
              href='/ask'
              className='flex flex-col items-center rounded-lg border border-neutral-200 bg-[#ffffff] p-6 text-center transition hover:border-red-200 hover:shadow-md'
            >
              <BrainCircuit className='mb-3 h-8 w-8 text-red-600' />
              <h3 className='mb-2 text-lg font-semibold text-neutral-900'>
                Ask a Question
              </h3>
              <p className='text-sm text-neutral-600'>
                Share what&apos;s on your heart and receive wisdom through
                relevant quotations.
              </p>
              <span className='mt-4 text-sm font-semibold text-red-600'>
                Ask Now →
              </span>
            </Link>

            <Link
              href='/quotations'
              className='flex flex-col items-center rounded-lg border border-neutral-200 bg-[#ffffff] p-6 text-center transition hover:border-red-200 hover:shadow-md'
            >
              <BookOpenCheck className='mb-3 h-8 w-8 text-red-600' />
              <h3 className='mb-2 text-lg font-semibold text-neutral-900'>
                Browse Quotations
              </h3>
              <p className='text-sm text-neutral-600'>
                Explore a curated collection of Jesus&apos;s most powerful
                teachings and sayings.
              </p>
              <span className='mt-4 text-sm font-semibold text-red-600'>
                View All →
              </span>
            </Link>

            <Link
              href='/store'
              className='flex flex-col items-center rounded-lg border border-neutral-200 bg-[#ffffff] p-6 text-center transition hover:border-red-200 hover:shadow-md'
            >
              <Store className='mb-3 h-8 w-8 text-red-600' />
              <h3 className='mb-2 text-lg font-semibold text-neutral-900'>
                Visit Our Store
              </h3>
              <p className='text-sm text-neutral-600'>
                Publications, prints, and merchandise featuring these timeless
                words.
              </p>
              <span className='mt-4 text-sm font-semibold text-red-600'>
                Shop Now →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
