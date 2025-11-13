import Link from 'next/link';

import { SectionHeader } from '@/components/ui/SectionHeader';

const items = [
  {
    title: 'Wisdom → Action Hoodie',
    description:
      'Organic cotton, 10% of every order funds urgent shelter meals.',
    price: '$64',
    image: '/images/store/hoodie-placeholder.jpg',
  },
  {
    title: 'Matthew 7:16 Journal',
    description:
      'Dot-grid, recycled paper, paired with weekly “fruit check” prompts.',
    price: '$24',
    image: '/images/store/journal-placeholder.jpg',
  },
  {
    title: 'Quote & Action Card Deck',
    description: '30 cards linking Scripture art to practical assignments.',
    price: '$38',
    image: '/images/store/cards-placeholder.jpg',
  },
];

export default function StorePage() {
  return (
    <div className='space-y-10 pb-16'>
      <section className='rounded-3xl border border-rose-200 bg-gradient-to-br from-[#fff7f0] via-white to-[#f1f4ff] p-8 shadow-lg shadow-rose-100/70'>
        <SectionHeader
          kicker='Purposeful Merch'
          title='Wear reminders, fuel relief'
          description='The store launches soon. Every drop funds micro-grants for the urgent opportunities listed across The Red Stuff.'
        />
        <p className='mt-4 text-sm text-neutral-700'>
          Want first dibs on limited runs? Join the waitlist and we’ll notify
          you before product drops.
        </p>
      </section>

      <div className='grid gap-4 md:grid-cols-3'>
        {items.map((item) => (
          <article
            key={item.title}
            className='flex flex-col rounded-2xl border border-rose-100 bg-white/90 p-5 text-sm text-neutral-700'
          >
            <div className='flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-white text-xs font-semibold uppercase tracking-[0.35em] text-rose-500'>
              {item.title}
            </div>
            <h3 className='mt-3 text-lg font-semibold text-neutral-900'>
              {item.title}
            </h3>
            <p className='text-sm text-neutral-600'>{item.description}</p>
            <p className='mt-2 text-base font-semibold text-neutral-900'>
              {item.price}
            </p>
            <span className='mt-auto text-xs font-semibold uppercase tracking-[0.3em] text-red-600'>
              Coming soon
            </span>
          </article>
        ))}
      </div>

      <div className='rounded-3xl border border-red-200 bg-red-50/70 p-6 text-sm text-neutral-700'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-700'>
          Notify me
        </p>
        <p className='mt-2 text-lg font-semibold text-neutral-900'>
          Drop your email to hear about the next capsule release.
        </p>
        <Link
          href='https://theredstuff.org/store-waitlist'
          className='mt-3 inline-flex items-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-300/60'
        >
          Join waitlist
        </Link>
      </div>
    </div>
  );
}
