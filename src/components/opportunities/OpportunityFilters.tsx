'use client';

import {
  LocateFixed,
  MapPinned,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const causeOptions = [
  { value: 'all', label: 'All causes' },
  { value: 'hunger', label: 'Feeding + Food Security' },
  { value: 'homelessness', label: 'Shelter + Housing' },
  { value: 'education', label: 'Education' },
  { value: 'children', label: 'Children / Youth' },
  { value: 'elderly', label: 'Elder Care' },
  { value: 'healthcare', label: 'Healthcare + Healing' },
  { value: 'prison', label: 'Prison + Reentry' },
  { value: 'environment', label: 'Creation Care' },
  { value: 'justice', label: 'Peace + Justice' },
  { value: 'community', label: 'Community Life' },
  { value: 'family', label: 'Family Support' },
];

export interface FilterState {
  location: string;
  cause: string;
  timeCommitment: string;
  mode: string;
  urgency: string;
  skills: string[];
  search: string;
}

interface OpportunityFiltersProps {
  initialFilters?: Partial<FilterState>;
  onChange?: (filters: FilterState) => void;
}

const defaultFilters: FilterState = {
  location: '',
  cause: 'all',
  timeCommitment: 'any',
  mode: 'any',
  urgency: 'any',
  skills: [],
  search: '',
};

export function OpportunityFilters({
  initialFilters,
  onChange,
}: OpportunityFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [skillsInput, setSkillsInput] = useState(filters.skills.join(', '));
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!initialFilters) return;
    setFilters((prev) => ({
      ...prev,
      ...initialFilters,
    }));
    if (initialFilters.skills) {
      setSkillsInput(initialFilters.skills.join(', '));
    }
  }, [initialFilters]);

  useEffect(() => {
    onChange?.(filters);
  }, [filters, onChange]);

  const handleReset = () => {
    setFilters(defaultFilters);
    setSkillsInput('');
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setFilters((prev) => ({
          ...prev,
          location: `${position.coords.latitude.toFixed(
            2
          )}, ${position.coords.longitude.toFixed(2)}`,
        }));
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className='rounded-3xl border border-rose-200 bg-white/90 p-5 shadow-lg shadow-rose-100/60'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <span className='inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600'>
            <SlidersHorizontal className='h-5 w-5' strokeWidth={1.8} />
          </span>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
              Search filters
            </p>
            <p className='text-sm font-medium text-neutral-700'>
              Refine by cause, commitment, and skills
            </p>
          </div>
        </div>
        <button
          type='button'
          className='inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400'
          onClick={handleReset}
        >
          <RotateCcw className='h-4 w-4' />
          Reset
        </button>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700 md:col-span-2 lg:col-span-3'>
          Search opportunities
          <input
            type='text'
            value={filters.search}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, search: event.target.value }))
            }
            placeholder='Search titles, organizations, reflections'
            className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          />
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Location
          <div className='flex gap-2'>
            <div className='flex grow items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'>
              <MapPinned className='h-4 w-4 text-red-500' />
              <input
                type='text'
                placeholder='City, State or Remote'
                value={filters.location}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    location: event.target.value,
                  }))
                }
                className='w-full border-none bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none'
              />
            </div>
            <button
              type='button'
              onClick={handleUseLocation}
              className='inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-100'
            >
              {isLocating ? (
                'Locating...'
              ) : (
                <>
                  <LocateFixed className='mr-1 h-4 w-4' />
                  Near me
                </>
              )}
            </button>
          </div>
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Cause
          <select
            value={filters.cause}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, cause: event.target.value }))
            }
            className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          >
            {causeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Time Commitment
          <select
            value={filters.timeCommitment}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                timeCommitment: event.target.value,
              }))
            }
            className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          >
            {[
              'any',
              'one-time',
              'weekly',
              'monthly',
              'seasonal',
              'ongoing',
            ].map((value) => (
              <option key={value} value={value}>
                {value === 'any'
                  ? 'Any schedule'
                  : value
                      .split('-')
                      .map((word) => word[0]?.toUpperCase() + word.slice(1))
                      .join(' ')}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Serving Mode
          <select
            value={filters.mode}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, mode: event.target.value }))
            }
            className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          >
            {[
              { value: 'any', label: 'Remote + Local' },
              { value: 'local', label: 'In person' },
              { value: 'remote', label: 'Virtual' },
              { value: 'hybrid', label: 'Hybrid' },
            ].map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700'>
          Urgency
          <select
            value={filters.urgency}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, urgency: event.target.value }))
            }
            className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          >
            {[
              { value: 'any', label: 'Any' },
              { value: 'immediate', label: 'Urgent (72 hrs)' },
              { value: 'seasonal', label: 'Seasonal' },
              { value: 'ongoing', label: 'Ongoing need' },
            ].map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-semibold text-neutral-700 md:col-span-2 lg:col-span-3'>
          Skills or interests
          <input
            type='text'
            placeholder='e.g. mentoring, Spanish, design'
            value={skillsInput}
            onChange={(event) => {
              setSkillsInput(event.target.value);
              const values = event.target.value
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean);
              setFilters((prev) => ({ ...prev, skills: values }));
            }}
            className='rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100'
          />
        </label>
      </div>
    </div>
  );
}
