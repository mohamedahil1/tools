export function sanitizeFilename(name: string) {
  const base = name.split(/[/\\\\]/).pop() ?? 'file';
  const cleaned = base.replace(/[^\w.\-()+ ]+/g, '_').trim();
  return cleaned.length ? cleaned : 'file';
}

export function bytesFromMb(mb: number) {
  return Math.floor(mb * 1024 * 1024);
}

export function assertMaxSize(bytes: number, maxMb: number) {
  const max = bytesFromMb(maxMb);
  if (bytes > max) {
    throw new Error(`File is too large. Max ${maxMb}MB.`);
  }
}

export function assertAccept(mime: string | undefined, accept: string | undefined) {
  if (!accept) return;
  if (!mime) throw new Error('Unsupported file type.');

  const parts = accept.split(',').map((s) => s.trim()).filter(Boolean);
  const ok = parts.some((p) => {
    if (p.endsWith('/*')) return mime.startsWith(p.slice(0, -1));
    return mime === p;
  });
  if (!ok) throw new Error('Unsupported file type.');
}

