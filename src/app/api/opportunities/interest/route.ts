import { NextRequest, NextResponse } from 'next/server';

import { recordOpportunityInterest } from '@/lib/opportunity-service';

export async function POST(request: NextRequest) {
  const payload = await request.json();

  if (!payload?.opportunityId) {
    return NextResponse.json(
      { error: 'opportunityId is required' },
      { status: 400 }
    );
  }

  try {
    await recordOpportunityInterest({
      opportunityId: payload.opportunityId,
      userId: payload.userId,
      userEmail: payload.userEmail,
      context: payload.context,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to record interest',
      },
      { status: 500 }
    );
  }
}
