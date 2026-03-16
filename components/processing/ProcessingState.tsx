'use client';

import { Loader2, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

export type ProcessResult = {
  jobId: string;
  downloadUrl: string;
  outputName: string;
  beforeBytes?: number;
  afterBytes?: number;
};

function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function ProcessingState({
  isProcessing,
  result,
  error
}: {
  isProcessing: boolean;
  result: ProcessResult | null;
  error: string | null;
}) {
  if (isProcessing) {
    return (
      <div className="glass rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
          <div>
            <div className="font-medium text-white">Processing your file...</div>
            <div className="text-sm text-white/60">This usually takes just a moment.</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl border border-red-400/20 p-6 shadow-soft">
        <div className="font-medium text-white">Something went wrong</div>
        <div className="mt-2 text-sm text-white/70">{error}</div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="glass rounded-2xl p-6 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium text-white">Done</div>
          <div className="mt-1 text-sm text-white/60">
            Before: {formatBytes(result.beforeBytes)} · After: {formatBytes(result.afterBytes)}
          </div>
        </div>
        <Button asChild>
          <a href={result.downloadUrl} download>
            <Download className="h-4 w-4" />
            Download result
          </a>
        </Button>
      </div>
    </div>
  );
}

