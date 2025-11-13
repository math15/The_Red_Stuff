import { NextResponse } from 'next/server';

import { getFeaturedOpportunities } from '@/lib/opportunity-service';

export async function GET() {
  const data = await getFeaturedOpportunities();
  return NextResponse.json({ data });
}
