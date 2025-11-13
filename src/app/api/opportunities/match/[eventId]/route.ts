import { NextResponse } from 'next/server';

import { loadCurrentEvents } from '@/lib/data-sources';
import { getOpportunitiesMatchingEvent } from '@/lib/opportunity-service';

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  const events = await loadCurrentEvents();
  const event = events.find((item) => item.id === params.eventId);

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const data = await getOpportunitiesMatchingEvent(event.id);
  return NextResponse.json({ data, event });
}
