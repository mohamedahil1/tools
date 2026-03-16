import fs from 'node:fs/promises';
import path from 'node:path';

import { env } from '@/lib/server/env';

export type JobMeta = {
  id: string;
  createdAt: number;
  inputFiles: { name: string; size: number; type?: string }[];
  outputFile?: { name: string; path: string; type: string; size: number };
  stats?: { beforeBytes?: number; afterBytes?: number };
};

const baseDir = path.join(process.cwd(), '.tmp', 'jobs');

export async function ensureTmp() {
  await fs.mkdir(baseDir, { recursive: true });
  return baseDir;
}

export async function createJob() {
  await ensureTmp();
  const id = crypto.randomUUID();
  const dir = path.join(baseDir, id);
  await fs.mkdir(dir, { recursive: true });
  const meta: JobMeta = { id, createdAt: Date.now(), inputFiles: [] };
  await writeJobMeta(id, meta);
  return { id, dir };
}

export function jobDir(id: string) {
  return path.join(baseDir, id);
}

export async function readJobMeta(id: string): Promise<JobMeta | null> {
  try {
    const raw = await fs.readFile(path.join(jobDir(id), 'meta.json'), 'utf8');
    return JSON.parse(raw) as JobMeta;
  } catch {
    return null;
  }
}

export async function writeJobMeta(id: string, meta: JobMeta) {
  await fs.writeFile(path.join(jobDir(id), 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
}

export async function cleanupOldJobs() {
  await ensureTmp();
  const now = Date.now();
  const entries = await fs.readdir(baseDir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((e) => e.isDirectory())
      .map(async (e) => {
        const id = e.name;
        const meta = await readJobMeta(id);
        const createdAt = meta?.createdAt ?? 0;
        if (now - createdAt > env.TMP_TTL_MS) {
          await fs.rm(jobDir(id), { recursive: true, force: true });
        }
      })
  );
}

export async function maybeCleanup() {
  if (Math.random() < 0.05) {
    await cleanupOldJobs();
  }
}

