import { spawn, spawnSync } from 'node:child_process';

let cached: boolean | null = null;

export function ffmpegAvailable() {
  if (cached != null) return cached;
  try {
    const res = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    cached = res.status === 0;
    return cached;
  } catch {
    cached = false;
    return false;
  }
}

export async function runFfmpeg(args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const p = spawn('ffmpeg', ['-y', ...args], { stdio: 'ignore' });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg failed (code ${code}).`));
    });
  });
}

