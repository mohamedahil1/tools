import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

import { maybeCleanup, readJobMeta } from '@/lib/server/tmp';

export async function GET(
  _req: Request,
  { params }: { params: { jobId: string } }
) {
  await maybeCleanup();
  const meta = await readJobMeta(params.jobId);
  if (!meta?.outputFile) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const filePath = meta.outputFile.path;
  const buf = await fs.readFile(filePath);
  const res = new NextResponse(buf, {
    headers: {
      'Content-Type': meta.outputFile.type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        meta.outputFile.name
      )}"`,
      'Cache-Control': 'no-store'
    }
  });

  // Best-effort cleanup after download (non-blocking)
  setTimeout(() => {
    fs.rm(path.dirname(filePath), { recursive: true, force: true }).catch(() => {});
  }, 30_000);

  return res;
}

