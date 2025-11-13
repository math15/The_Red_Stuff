'use client';

import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { UserActionsService } from '@/lib/user-actions.client';

interface OpportunityInterestFormProps {
  opportunityId: string;
  applicationUrl?: string;
}

export function OpportunityInterestForm({
  opportunityId,
  applicationUrl,
}: OpportunityInterestFormProps) {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/opportunities/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          userEmail: email || undefined,
          context: { note },
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to record interest');
      }

      // Track engagement
      UserActionsService.trackEngagement({
        eventType: 'interest_expressed',
        eventData: { opportunity_id: opportunityId },
      });

      setStatus('success');
      setEmail('');
      setNote('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 rounded-2xl border border-rose-200 bg-white/90 p-5 text-sm text-neutral-700'
    >
      <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
        I’m interested
      </p>
      <p className='text-sm text-neutral-600'>
        We’ll notify the partner organization and email you next steps.
      </p>
      <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
        Preferred email
        <input
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='you@email.com'
          className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
        />
      </label>
      <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
        Note for coordinators (optional)
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder='Share availability, skills, or prayer covering.'
          className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
        />
      </label>

      <button
        type='submit'
        className='flex w-full items-center justify-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/40 transition hover:-translate-y-0.5'
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            Sending
          </>
        ) : (
          <>
            <Send className='h-4 w-4' />
            Notify me
          </>
        )}
      </button>

      {status === 'success' ? (
        <p className='flex items-center gap-2 text-sm font-semibold text-green-700'>
          <CheckCircle2 className='h-4 w-4' />
          Interest recorded. Watch your inbox!
        </p>
      ) : null}
      {status === 'error' ? (
        <p className='text-sm font-semibold text-red-600'>
          Could not send right now. Please try again shortly.
        </p>
      ) : null}

      {applicationUrl ? (
        <a
          href={applicationUrl}
          target='_blank'
          rel='noreferrer'
          className='mt-3 inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400'
        >
          Visit partner application →
        </a>
      ) : null}
    </form>
  );
}
