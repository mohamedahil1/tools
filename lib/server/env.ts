function parseBool(v: string | undefined, fallback: boolean) {
  if (v == null) return fallback;
  const s = v.trim().toLowerCase();
  if (s === '1' || s === 'true' || s === 'yes' || s === 'on') return true;
  if (s === '0' || s === 'false' || s === 'no' || s === 'off') return false;
  return fallback;
}

function parseNumber(v: string | undefined, fallback: number) {
  if (v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  ENABLE_FFMPEG: parseBool(process.env.ENABLE_FFMPEG, false),
  ENABLE_BG_REMOVAL: parseBool(process.env.ENABLE_BG_REMOVAL, false),
  ENABLE_PDF_TO_WORD: parseBool(process.env.ENABLE_PDF_TO_WORD, false),
  TMP_TTL_MS: parseNumber(process.env.TMP_TTL_MS, 15 * 60_000),
  MAX_UPLOAD_MB_DEFAULT: parseNumber(process.env.MAX_UPLOAD_MB_DEFAULT, 50)
} as const;

