import { Quote } from '@/types';

interface QuoteCardProps {
  quote: Quote;
  highlight?: boolean;
}

export function QuoteCard({ quote, highlight = false }: QuoteCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 text-sm text-neutral-700 ${
        highlight
          ? 'border-red-200 bg-gradient-to-br from-red-50 via-white to-rose-50 shadow-lg shadow-red-100/70'
          : 'border-rose-100 bg-white/90'
      }`}
    >
      <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
        {quote.reference}
      </p>
      <div className='mt-3 flex flex-1 flex-col'>
        <p className='text-lg font-semibold text-neutral-900'>“{quote.text}”</p>
        {quote.context ? (
          <p className='mt-2 text-xs text-neutral-500'>{quote.context}</p>
        ) : null}
      </div>
      <div className='mt-3 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-500'>
        {quote.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className='rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-600'
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
