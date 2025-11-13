import { NextRequest, NextResponse } from 'next/server';

import {
  getOpportunityById,
  getQuotesForOpportunity,
} from '@/lib/opportunity-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const opportunity = await getOpportunityById(params.id);

  if (!opportunity) {
    return NextResponse.json(
      { error: 'Opportunity not found' },
      { status: 404 }
    );
  }

  const relatedQuotes = await getQuotesForOpportunity(opportunity);

  return NextResponse.json({
    data: {
      opportunity,
      relatedQuotes,
    },
  });
}
