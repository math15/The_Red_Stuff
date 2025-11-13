import { NextResponse } from 'next/server';

import { loadCurrentEvents } from '@/lib/data-sources';

export const revalidate = 600;

export async function GET() {
  const events = await loadCurrentEvents();
  return NextResponse.json({ data: events });
}
