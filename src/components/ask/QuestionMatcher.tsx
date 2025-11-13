'use client';

import { Loader2, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { useQuestionMatch } from '@/hooks/useAIMatcher';

export function QuestionMatcher() {
  const [question, setQuestion] = useState('');
  const { loading, error, data, matchQuestion } = useQuestionMatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await matchQuestion(question);
  };

  return (
    <div className='space-y-8'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='question'
            className='block text-sm font-semibold text-neutral-700'
          >
            What's on your heart?
          </label>
          <textarea
            id='question'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder='How can I respond to...? Where is Jesus in...? What should I do about...?'
            className='mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-neutral-800 placeholder:text-neutral-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          />
        </div>

        <button
          type='submit'
          disabled={loading || !question.trim()}
          className='flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition hover:-translate-y-0.5 disabled:opacity-50'
        >
          {loading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Finding wisdom...
            </>
          ) : (
            <>
              <Send className='h-4 w-4' />
              Ask
            </>
          )}
        </button>
      </form>

      {error && (
        <div className='rounded-3xl border border-red-200 bg-red-50/80 p-4 text-center text-sm font-semibold text-red-700'>
          {error}
        </div>
      )}

      {data && (
        <div className='space-y-8'>
          {/* Reflection */}
          <div className='rounded-3xl border border-amber-200 bg-amber-50/70 p-6'>
            <div className='flex items-start gap-3'>
              <Sparkles className='h-5 w-5 text-amber-600' />
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.35em] text-amber-700'>
                  Reflection
                </p>
                <p className='mt-2 text-base text-neutral-800'>
                  {data.reflection}
                </p>
              </div>
            </div>
          </div>

          {/* Matched Quotes */}
          {data.quotes.length > 0 && (
            <div>
              <h3 className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
                Wisdom for Your Journey
              </h3>
              <div className='mt-4 space-y-4'>
                {data.quotes.map(({ quote, relevance }) => (
                  <article
                    key={quote.id}
                    className='rounded-3xl border border-rose-200 bg-gradient-to-br from-white to-rose-50/50 p-6'
                  >
                    <p className='text-xs font-semibold uppercase tracking-[0.3em] text-red-600'>
                      {quote.reference}
                    </p>
                    <blockquote className='mt-3 text-lg font-semibold text-neutral-900'>
                      "{quote.text}"
                    </blockquote>
                    {quote.context && (
                      <p className='mt-2 text-sm text-neutral-600'>
                        {quote.context}
                      </p>
                    )}
                    <div className='mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-3'>
                      <p className='text-xs font-semibold uppercase tracking-[0.3em] text-amber-700'>
                        Why this matters
                      </p>
                      <p className='mt-1 text-sm text-neutral-700'>
                        {relevance}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Matched Opportunities */}
          {data.opportunities.length > 0 && (
            <div>
              <h3 className='text-xs font-semibold uppercase tracking-[0.35em] text-green-700'>
                Turn Wisdom into Action
              </h3>
              <div className='mt-4 space-y-4'>
                {data.opportunities.map(({ opportunity, reasoning }) => (
                  <Link
                    key={opportunity.id}
                    href={`/opportunities/${opportunity.id}`}
                    className='block rounded-3xl border border-green-200 bg-gradient-to-br from-white to-green-50/50 p-6 transition hover:-translate-y-1 hover:shadow-xl'
                  >
                    <p className='text-xs font-semibold uppercase tracking-[0.3em] text-green-700'>
                      {opportunity.organization_name}
                    </p>
                    <h4 className='mt-2 text-lg font-semibold text-neutral-900'>
                      {opportunity.opportunity_title}
                    </h4>
                    <p className='mt-2 text-sm text-neutral-700'>
                      {opportunity.description.substring(0, 150)}...
                    </p>
                    <div className='mt-4 rounded-2xl border border-green-100 bg-green-50/50 p-3'>
                      <p className='text-xs font-semibold uppercase tracking-[0.3em] text-green-700'>
                        Why this fits
                      </p>
                      <p className='mt-1 text-sm text-neutral-700'>
                        {reasoning}
                      </p>
                    </div>
                    <div className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700'>
                      Learn more →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
