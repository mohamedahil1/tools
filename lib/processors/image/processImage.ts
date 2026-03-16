import sharp from 'sharp';

export type ImageFormat = 'png' | 'jpg' | 'webp';

export async function compressImage(input: Buffer, opts: { quality: number }) {
  const quality = Math.min(100, Math.max(1, Math.round(opts.quality)));
  const out = await sharp(input).webp({ quality }).toBuffer();
  return { buffer: out, ext: 'webp' as const, mime: 'image/webp' as const };
}

export async function resizeImage(input: Buffer, opts: { width: number; height: number }) {
  const width = Math.max(1, Math.round(opts.width));
  const height = Math.max(1, Math.round(opts.height));
  const out = await sharp(input).resize({ width, height, fit: 'inside' }).png().toBuffer();
  return { buffer: out, ext: 'png' as const, mime: 'image/png' as const };
}

export async function convertImage(input: Buffer, opts: { format: ImageFormat; quality?: number }) {
  const format = opts.format;
  const q = opts.quality == null ? 85 : Math.min(100, Math.max(1, Math.round(opts.quality)));
  const s = sharp(input);
  if (format === 'png') {
    const out = await s.png().toBuffer();
    return { buffer: out, ext: 'png' as const, mime: 'image/png' as const };
  }
  if (format === 'jpg') {
    const out = await s.jpeg({ quality: q }).toBuffer();
    return { buffer: out, ext: 'jpg' as const, mime: 'image/jpeg' as const };
  }
  const out = await s.webp({ quality: q }).toBuffer();
  return { buffer: out, ext: 'webp' as const, mime: 'image/webp' as const };
}

