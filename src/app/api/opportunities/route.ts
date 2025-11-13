import { NextRequest, NextResponse } from 'next/server';

import { filterOpportunities } from '@/lib/opportunity-service';

import {
  CauseCategory,
  OpportunityLocationMode,
  TimeCommitment,
  UrgencyLevel,
} from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = Number(searchParams.get('limit') ?? '50');
  const offset = Number(searchParams.get('offset') ?? '0');
  const location = searchParams.get('location') ?? undefined;
  const rawCategory = searchParams.get('category') ?? undefined;
  const rawMode = searchParams.get('mode') ?? undefined;
  const rawSkills = searchParams.get('skills') ?? undefined;
  const rawUrgency = searchParams.get('urgency') ?? undefined;
  const rawTimeCommitment = searchParams.get('timeCommitment') ?? undefined;
  const rawSearch = searchParams.get('search') ?? undefined;

  let cause: CauseCategory | CauseCategory[] | 'all' | undefined;
  if (rawCategory) {
    if (rawCategory === 'all') {
      cause = 'all';
    } else if (rawCategory.includes(',')) {
      cause = rawCategory
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean) as CauseCategory[];
    } else {
      cause = rawCategory as CauseCategory;
    }
  }

  const normalizedMode =
    !rawMode || rawMode === 'all'
      ? undefined
      : rawMode === 'virtual'
      ? 'remote'
      : rawMode;

  const normalizedUrgency =
    !rawUrgency || rawUrgency === 'all' ? undefined : rawUrgency;

  const normalizedTimeCommitment =
    !rawTimeCommitment || rawTimeCommitment === 'all'
      ? undefined
      : rawTimeCommitment;

  const filters = {
    location,
    cause,
    timeCommitment:
      (normalizedTimeCommitment as TimeCommitment | 'any' | undefined) ??
      undefined,
    skills: rawSkills
      ?.split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
    mode: normalizedMode as OpportunityLocationMode | 'any' | undefined,
    urgency:
      (normalizedUrgency as UrgencyLevel | 'any' | undefined) ?? undefined,
    search: rawSearch ?? undefined,
  };

  const data = await filterOpportunities({
    ...filters,
    limit,
    offset,
  });

  return NextResponse.json({
    data,
    meta: {
      limit,
      offset,
      count: data.length,
    },
  });
}
