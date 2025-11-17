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
          ? 'border-red-200 bg-[#ffffff] shadow-lg shadow-red-100/70'
          : 'border-rose-100 bg-[#ffffff]'
      }`}
    >
      <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500'>
        {quote.reference}
      </p>
      <div className='mt-3 flex flex-1 flex-col'>
        <p className='text-lg font-semibold !text-red-600'>"{quote.text}"</p>
        {quote.context ? (
          <p className='mt-2 text-xs text-neutral-500'>{quote.context}</p>
        ) : null}
      </div>
      <div className='mt-3 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-500'>
        {quote.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className='rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600'
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
