import { quotes } from '@/data/quotes';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default function QuotationsPage() {
  return (
    <div className='space-y-10 pb-16'>
      <PageViewTracker pageName='quotations' />
      <section className='rounded-3xl border border-rose-200 bg-gradient-to-br from-[#fff6ef] via-white to-[#f7f0ea] p-8 shadow-lg shadow-rose-100/70'>
        <SectionHeader
          kicker='Scripture Library'
          title='Match Jesus’s words with today’s chaos'
          description='Browse the sayings of Christ organized by theme. Save your favorites; each quote unlocks aligned action pathways.'
        />
        <p className='mt-4 text-sm text-neutral-700'>
          Coming soon: search by mood, news headline, or personal question. For
          now, meditate on the highlighted words below.
        </p>
      </section>

      <div className='grid gap-4 md:grid-cols-3'>
        {quotes.slice(0, 12).map((quote, index) => (
          <QuoteCard key={quote.id} quote={quote} highlight={index === 0} />
        ))}
      </div>
    </div>
  );
}
