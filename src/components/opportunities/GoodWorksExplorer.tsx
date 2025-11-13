'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { quotes } from '@/data/quotes';

import { OpportunityCard } from './OpportunityCard';
import { FilterState, OpportunityFilters } from './OpportunityFilters';

import { Opportunity } from '@/types';

interface GoodWorksExplorerProps {
  initialFilters?: Partial<FilterState>;
  initialResults: Opportunity[];
}

const defaultFilterState: FilterState = {
  location: '',
  cause: 'all',
  timeCommitment: 'any',
  mode: 'any',
  urgency: 'any',
  skills: [],
  search: '',
};

const buildQueryString = (filters: FilterState) => {
  const params = new URLSearchParams();

  if (filters.location) params.set('location', filters.location);
  if (filters.cause && filters.cause !== 'all')
    params.set('category', filters.cause);
  if (filters.timeCommitment && filters.timeCommitment !== 'any') {
    params.set('timeCommitment', filters.timeCommitment);
  }
  if (filters.mode && filters.mode !== 'any') params.set('mode', filters.mode);
  if (filters.urgency && filters.urgency !== 'any')
    params.set('urgency', filters.urgency);
  if (filters.search) params.set('search', filters.search);
  if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));

  return params.toString();
};

export function GoodWorksExplorer({
  initialFilters,
  initialResults,
}: GoodWorksExplorerProps) {
  const mergedInitial = useMemo(
    () => ({
      ...defaultFilterState,
      ...initialFilters,
    }),
    [initialFilters]
  );

  const [filters, setFilters] = useState<FilterState>(mergedInitial);
  const [results, setResults] = useState<Opportunity[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilters(mergedInitial);
  }, [mergedInitial]);

  useEffect(() => {
    const controller = new AbortController();
    const query = buildQueryString(filters);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/opportunities?${query}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Unable to fetch opportunities');
        }
        const json = await response.json();
        setResults(json.data);
        setError(null);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setError('Unable to refresh opportunities. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [filters]);

  const handleFilterChange = (nextFilters: FilterState) => {
    setFilters(nextFilters);
  };

  return (
    <div className='space-y-6'>
      <OpportunityFilters
        initialFilters={mergedInitial}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <div className='flex flex-col items-center gap-2 rounded-3xl border border-rose-200 bg-white/80 p-10 text-sm text-neutral-600'>
          <Loader2 className='h-5 w-5 animate-spin text-red-600' />
          Refreshing matches…
        </div>
      ) : null}
      {error ? (
        <div className='rounded-3xl border border-red-200 bg-red-50/80 p-4 text-center text-sm font-semibold text-red-700'>
          {error}
        </div>
      ) : null}

      {results.length === 0 ? (
        <div className='rounded-3xl border border-rose-200 bg-white/90 p-8 text-center text-sm text-neutral-600'>
          <p>No opportunities match those filters yet.</p>
          <p className='mt-2'>
            Try widening your location or selecting “Any schedule” to discover
            more matches.
          </p>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2'>
          {results.map((opportunity) => {
            const quote = opportunity.related_quotes
              .map((id) => quotes.find((item) => item.id === id))
              .find(Boolean);
            return (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                quote={quote}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
