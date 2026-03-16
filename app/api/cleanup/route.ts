import { NextResponse } from 'next/server';

import { cleanupOldJobs } from '@/lib/server/tmp';

export const runtime = 'nodejs';

export async function POST() {
  await cleanupOldJobs();
  return NextResponse.json({ ok: true });
}

