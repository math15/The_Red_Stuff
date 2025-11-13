'use client';

import { Loader2, Sparkles, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import logger from '@/lib/logger';

import { OpportunityCard } from './OpportunityCard';

import { CauseCategory, Opportunity } from '@/types';

const storageKey = 'trs-recommendation-signals';

type Signals = {
  cause: CauseCategory | 'all';
  skills: string[];
  location: string;
};

const causeOptions: { value: Signals['cause']; label: string }[] = [
  { value: 'all', label: 'All causes' },
  { value: 'hunger', label: 'Hunger & Food Security' },
  { value: 'homelessness', label: 'Shelter & Housing' },
  { value: 'education', label: 'Education' },
  { value: 'children', label: 'Children & Youth' },
  { value: 'elderly', label: 'Elder Care' },
  { value: 'healthcare', label: 'Healthcare & Healing' },
  { value: 'prison', label: 'Prison & Reentry' },
  { value: 'environment', label: 'Creation Care' },
  { value: 'justice', label: 'Peace & Justice' },
  { value: 'community', label: 'Community Life' },
  { value: 'family', label: 'Family Support' },
  { value: 'youth', label: 'Youth Leadership' },
];

const defaultSignals: Signals = {
  cause: 'all',
  skills: [],
  location: '',
};

const buildQuery = (signals: Signals) => {
  const params = new URLSearchParams();
  if (signals.cause && signals.cause !== 'all') {
    params.set('interests', signals.cause);
  }
  if (signals.skills.length > 0) {
    params.set('skills', signals.skills.join(','));
  }
  if (signals.location) {
    const [city, region] = signals.location
      .split(',')
      .map((item) => item.trim());
    if (city) params.set('city', city);
    if (region) params.set('region', region);
  }
  return params.toString();
};

export function RecommendationsPanel() {
  const [signals, setSignals] = useState<Signals>(() => {
    if (typeof window === 'undefined') return defaultSignals;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return defaultSignals;
      const parsed = JSON.parse(stored) as Signals;
      return { ...defaultSignals, ...parsed };
    } catch {
      return defaultSignals;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Opportunity[]>([]);

  const skillsInput = useMemo(
    () => signals.skills.join(', '),
    [signals.skills]
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(signals));
  }, [signals]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const query = buildQuery(signals);
        const response = await fetch(
          `/api/opportunities/recommendations${query ? `?${query}` : ''}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('Unable to fetch recommendations');
        }
        const json = await response.json();
        setRecommendations(json.data);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          logger(error, 'recommendations-panel');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
    return () => controller.abort();
  }, [signals]);

  return (
    <section className='space-y-6 rounded-3xl border border-green-200 bg-green-50/60 p-6'>
      <div className='flex flex-wrap items-center gap-4'>
        <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm'>
          <Sparkles className='h-5 w-5' />
        </span>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-green-700'>
            Personalized Recommendations
          </p>
          <p className='text-base font-semibold text-neutral-900'>
            Tune your interests to see curated volunteer roles
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Cause focus
          <select
            value={signals.cause}
            onChange={(event) =>
              setSignals((prev) => ({
                ...prev,
                cause: event.target.value as Signals['cause'],
              }))
            }
            className='rounded-2xl border border-green-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
          >
            {causeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Skills or interests
          <input
            type='text'
            value={skillsInput}
            onChange={(event) =>
              setSignals((prev) => ({
                ...prev,
                skills: event.target.value
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean),
              }))
            }
            placeholder='e.g. Spanish, design, mentoring'
            className='rounded-2xl border border-green-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
          />
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          City or region
          <div className='flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-3 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200'>
            <Target className='h-4 w-4 text-green-600' />
            <input
              type='text'
              value={signals.location}
              onChange={(event) =>
                setSignals((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              placeholder='City, ST (optional)'
              className='w-full border-none bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none'
            />
          </div>
        </label>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center gap-2 rounded-2xl border border-green-200 bg-white/90 p-6 text-sm text-neutral-600'>
          <Loader2 className='h-5 w-5 animate-spin text-green-600' />
          Updating matches…
        </div>
      ) : recommendations.length === 0 ? (
        <div className='rounded-2xl border border-green-200 bg-white/90 p-6 text-center text-sm text-neutral-600'>
          We couldn’t find a match for that combo yet. Try broadening the cause
          or removing skills.
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {recommendations.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </section>
  );
}
