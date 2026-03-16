import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

import { env } from '@/lib/server/env';
import { rateLimit } from '@/lib/server/rateLimit';
import { createJob, maybeCleanup, readJobMeta, writeJobMeta } from '@/lib/server/tmp';
import { assertAccept, assertMaxSize, sanitizeFilename } from '@/lib/server/uploads';
import { compressImage, convertImage, resizeImage } from '@/lib/processors/image/processImage';
import { mergePdfs, optimizePdfPlaceholder, splitPdfToZip } from '@/lib/processors/pdf/processPdf';
import { ffmpegAvailable, runFfmpeg } from '@/lib/processors/video/ffmpeg';

export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: { toolSlug: string } }) {
  await maybeCleanup();

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const rl = rateLimit({ key: `tool:${params.toolSlug}:${ip}`, limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 });
  }

  try {
    const form = await req.formData();
    const files = form.getAll('files').filter(Boolean) as File[];
    const rawOptions = form.get('options');
    const options =
      typeof rawOptions === 'string'
        ? (JSON.parse(rawOptions) as Record<string, unknown>)
        : {};

    const slug = params.toolSlug;
    const toolConfig: { accept?: string; maxMb?: number } = (() => {
      if (slug.startsWith('image-')) return { accept: 'image/*', maxMb: 25 };
      if (slug.includes('pdf') || slug.endsWith('-pdf')) return { accept: 'application/pdf', maxMb: 50 };
      if (slug.startsWith('video-')) return { accept: 'video/*', maxMb: 250 };
      return { maxMb: env.MAX_UPLOAD_MB_DEFAULT };
    })();

    // Feature-flagged placeholders
    if (slug === 'image-background-remover' && !env.ENABLE_BG_REMOVAL) {
      return NextResponse.json(
        { error: 'Background removal is not enabled on this deployment yet.' },
        { status: 501 }
      );
    }
    if (slug === 'pdf-to-word' && !env.ENABLE_PDF_TO_WORD) {
      return NextResponse.json(
        { error: 'PDF to Word is not enabled on this deployment yet.' },
        { status: 501 }
      );
    }
    if (
      (slug === 'video-compressor' ||
        slug === 'video-to-gif' ||
        slug === 'video-trimmer' ||
        slug === 'video-converter') &&
      !env.ENABLE_FFMPEG
    ) {
      return NextResponse.json(
        { error: 'FFmpeg tools are disabled on this deployment.' },
        { status: 501 }
      );
    }
    if (
      slug === 'video-compressor' ||
      slug === 'video-to-gif' ||
      slug === 'video-trimmer' ||
      slug === 'video-converter'
    ) {
      if (!ffmpegAvailable()) {
        return NextResponse.json(
          { error: 'FFmpeg is not available in this environment.' },
          { status: 501 }
        );
      }
    }

    const { id: jobId, dir } = await createJob();
    const inputDir = path.join(dir, 'input');
    const outputDir = path.join(dir, 'output');
    await fs.mkdir(inputDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    const meta = (await readJobMeta(jobId)) ?? { id: jobId, createdAt: Date.now(), inputFiles: [] };

    const requireFiles = slug !== 'qr-code-generator' && slug !== 'password-generator' && slug !== 'word-counter';
    if (requireFiles && files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 });
    }

    const maxMb =
      typeof toolConfig.maxMb === 'number' ? toolConfig.maxMb : env.MAX_UPLOAD_MB_DEFAULT;

    const inputBuffers: { buf: Buffer; name: string; type: string | undefined; size: number }[] = [];
    for (const f of files) {
      assertMaxSize(f.size, maxMb);
      assertAccept(f.type, toolConfig.accept);
      const name = sanitizeFilename(f.name);
      const buf = Buffer.from(await f.arrayBuffer());
      inputBuffers.push({ buf, name, type: f.type, size: f.size });
      meta.inputFiles.push({ name, size: f.size, type: f.type });
      await fs.writeFile(path.join(inputDir, name), buf);
    }

    let output: { buffer: Buffer; name: string; type: string };
    const beforeBytes = inputBuffers.reduce((a, b) => a + b.size, 0);

    if (slug === 'image-compressor') {
      const { buffer, ext, mime } = await compressImage(inputBuffers[0].buf, {
        quality: Number(options.quality ?? 75)
      });
      output = { buffer, name: `compressed.${ext}`, type: mime };
    } else if (slug === 'image-resizer') {
      const { buffer, ext, mime } = await resizeImage(inputBuffers[0].buf, {
        width: Number(options.width ?? 1200),
        height: Number(options.height ?? 1200)
      });
      output = { buffer, name: `resized.${ext}`, type: mime };
    } else if (slug === 'image-converter') {
      const { buffer, ext, mime } = await convertImage(inputBuffers[0].buf, {
        format: (options.format as 'png' | 'jpg' | 'webp') ?? 'webp',
        quality: Number(options.quality ?? 85)
      });
      output = { buffer, name: `converted.${ext}`, type: mime };
    } else if (slug === 'merge-pdf') {
      if (inputBuffers.length < 2) {
        return NextResponse.json({ error: 'Upload at least 2 PDFs to merge.' }, { status: 400 });
      }
      const merged = await mergePdfs(inputBuffers.map((b) => b.buf));
      output = { buffer: merged, name: 'merged.pdf', type: 'application/pdf' };
    } else if (slug === 'split-pdf') {
      const zip = await splitPdfToZip(inputBuffers[0].buf);
      output = { buffer: zip, name: 'split-pages.zip', type: 'application/zip' };
    } else if (slug === 'pdf-compressor') {
      const optimized = await optimizePdfPlaceholder(inputBuffers[0].buf);
      output = { buffer: optimized, name: 'optimized.pdf', type: 'application/pdf' };
    } else if (slug === 'image-background-remover') {
      return NextResponse.json(
        { error: 'Background removal provider not configured yet.' },
        { status: 501 }
      );
    } else if (slug === 'pdf-to-word') {
      return NextResponse.json({ error: 'PDF to Word not implemented yet.' }, { status: 501 });
    } else if (
      slug === 'video-compressor' ||
      slug === 'video-to-gif' ||
      slug === 'video-trimmer' ||
      slug === 'video-converter'
    ) {
      const inputName = inputBuffers[0].name;
      const inputPath = path.join(inputDir, inputName);
      if (slug === 'video-compressor') {
        const outName = 'compressed.mp4';
        const outPath = path.join(outputDir, outName);
        await runFfmpeg([
          '-i',
          inputPath,
          '-c:v',
          'libx264',
          '-preset',
          'veryfast',
          '-crf',
          String(Number(options.crf ?? 28)),
          '-c:a',
          'aac',
          '-b:a',
          '128k',
          outPath
        ]);
        const buf = await fs.readFile(outPath);
        output = { buffer: buf, name: outName, type: 'video/mp4' };
      } else if (slug === 'video-to-gif') {
        const outName = 'clip.gif';
        const outPath = path.join(outputDir, outName);
        const start = Number(options.start ?? 0);
        const duration = Number(options.duration ?? 5);
        await runFfmpeg([
          '-ss',
          String(Math.max(0, start)),
          '-t',
          String(Math.max(1, duration)),
          '-i',
          inputPath,
          '-vf',
          'fps=12,scale=480:-1:flags=lanczos',
          '-loop',
          '0',
          outPath
        ]);
        const buf = await fs.readFile(outPath);
        output = { buffer: buf, name: outName, type: 'image/gif' };
      } else if (slug === 'video-trimmer') {
        const outName = 'trimmed.mp4';
        const outPath = path.join(outputDir, outName);
        const start = Number(options.start ?? 0);
        const duration = Number(options.duration ?? 5);
        await runFfmpeg([
          '-ss',
          String(Math.max(0, start)),
          '-t',
          String(Math.max(1, duration)),
          '-i',
          inputPath,
          '-c',
          'copy',
          outPath
        ]);
        const buf = await fs.readFile(outPath);
        output = { buffer: buf, name: outName, type: 'video/mp4' };
      } else {
        const format = (options.format as string) ?? 'mp4';
        const outName = `converted.${format}`;
        const outPath = path.join(outputDir, outName);
        const common = ['-i', inputPath];
        if (format === 'webm') {
          await runFfmpeg([...common, '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-c:a', 'libopus', outPath]);
          const buf = await fs.readFile(outPath);
          output = { buffer: buf, name: outName, type: 'video/webm' };
        } else if (format === 'mov') {
          await runFfmpeg([...common, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-c:a', 'aac', outPath]);
          const buf = await fs.readFile(outPath);
          output = { buffer: buf, name: outName, type: 'video/quicktime' };
        } else {
          await runFfmpeg([...common, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-c:a', 'aac', outPath]);
          const buf = await fs.readFile(outPath);
          output = { buffer: buf, name: outName, type: 'video/mp4' };
        }
      }
    } else {
      return NextResponse.json({ error: 'Unknown tool.' }, { status: 404 });
    }

    const outPath = path.join(outputDir, output.name);
    await fs.writeFile(outPath, output.buffer);
    const afterBytes = output.buffer.byteLength;

    meta.outputFile = { name: output.name, path: outPath, type: output.type, size: afterBytes };
    meta.stats = { beforeBytes, afterBytes };
    await writeJobMeta(jobId, meta);

    return NextResponse.json({
      jobId,
      downloadUrl: `/api/download/${jobId}`,
      outputName: output.name,
      beforeBytes,
      afterBytes
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Processing failed.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

