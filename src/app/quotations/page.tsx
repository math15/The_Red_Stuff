import { quotes } from '@/data/quotes';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { QuoteCard } from '@/components/quotes/QuoteCard';

export default function QuotationsPage() {
  const beatitudes = [
    {
      text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
      ref: 'Matthew 5:3',
    },
    {
      text: 'Blessed are those who mourn, for they will be comforted.',
      ref: 'Matthew 5:4',
    },
    {
      text: 'Blessed are the meek, for they will inherit the earth.',
      ref: 'Matthew 5:5',
    },
    {
      text: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.',
      ref: 'Matthew 5:6',
    },
    {
      text: 'Blessed are the merciful, for they will be shown mercy.',
      ref: 'Matthew 5:7',
    },
    {
      text: 'Blessed are the pure in heart, for they will see God.',
      ref: 'Matthew 5:8',
    },
    {
      text: 'Blessed are the peacemakers, for they will be called children of God.',
      ref: 'Matthew 5:9',
    },
    {
      text: 'Blessed are those who are persecuted because of righteousness, for theirs is the kingdom of heaven.',
      ref: 'Matthew 5:10',
    },
  ];

  return (
    <div className='mx-auto w-[92%] max-w-6xl space-y-10 pb-16'>
      <PageViewTracker pageName='quotations' />
      <section className='rounded-3xl border border-rose-200 bg-[#ffffff] p-8 shadow-lg shadow-rose-100/70'>
        <p className='text-xs font-semibold uppercase tracking-[0.4em] text-red-600'>
          Quotations
        </p>
        <h1 className='mt-4 text-3xl font-semibold text-neutral-900 md:text-4xl'>
          Explore the direct words of Jesus Christ
        </h1>
      </section>

      <section className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-8 shadow-lg'>
        <p className='text-xs font-semibold uppercase tracking-[0.4em] text-neutral-700'>
          The Beatitudes
        </p>
        <h2 className='mt-3 text-2xl font-semibold text-neutral-900'>
          Foundation of Christ's Teaching
        </h2>
        <div className='mt-6 grid gap-4 md:grid-cols-2'>
          {beatitudes.map((beatitude, index) => (
            <div
              key={index}
              className='rounded-2xl border border-neutral-200 bg-[#ffffff] p-4'
            >
              <p className='text-base font-semibold text-red-600'>
                "{beatitude.text}"
              </p>
            </div>
          ))}
        </div>
        <p className='mt-4 text-right text-sm font-semibold text-neutral-500'>
          — Matthew 5:3-10
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
