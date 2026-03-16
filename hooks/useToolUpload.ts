'use client';

import * as React from 'react';

import type { ProcessResult } from '@/components/processing/ProcessingState';

export function useToolUpload(toolSlug: string) {
  const [progress, setProgress] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [result, setResult] = React.useState<ProcessResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(
    async (args: { files?: File[]; options?: Record<string, unknown> }) => {
      setError(null);
      setResult(null);
      setProgress(0);
      setIsProcessing(true);

      try {
        const form = new FormData();
        for (const f of args.files ?? []) form.append('files', f);
        form.append('options', JSON.stringify(args.options ?? {}));

        const url = `/tools/${toolSlug}/api`;
        const res: ProcessResult = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.responseType = 'json';
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            const json = xhr.response;
            if (xhr.status >= 200 && xhr.status < 300) resolve(json);
            else reject(new Error((json && (json.error as string)) || 'Request failed.'));
          };
          xhr.onerror = () => reject(new Error('Network error.'));
          xhr.send(form);
        });

        setResult(res);
        return res;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
        return null;
      } finally {
        setIsProcessing(false);
        setProgress(100);
      }
    },
    [toolSlug]
  );

  return { run, progress, isProcessing, result, error };
}

