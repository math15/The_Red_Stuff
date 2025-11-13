import { NextRequest, NextResponse } from 'next/server';

import { getRecommendations } from '@/lib/opportunity-service';

import { CauseCategory } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const quoteIds =
    searchParams
      .get('quoteIds')
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const interests =
    searchParams
      .get('interests')
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const skills =
    searchParams
      .get('skills')
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const city = searchParams.get('city') ?? undefined;
  const region = searchParams.get('region') ?? undefined;

  const data = await getRecommendations({
    recentQuoteIds: quoteIds,
    interests: interests as CauseCategory[],
    skills,
    location:
      city || region
        ? {
            city,
            region,
          }
        : undefined,
  });

  return NextResponse.json({ data });
}
