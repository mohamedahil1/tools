'use client';

import * as React from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function Dropzone({
  accept,
  multiple,
  files,
  onFilesChange,
  disabled
}: {
  accept?: string;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (disabled) return;
      const list = Array.from(e.dataTransfer.files);
      if (!list.length) return;
      onFilesChange(multiple ? list : [list[0]]);
    },
    [disabled, multiple, onFilesChange]
  );

  const onPick = React.useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  return (
    <div className="glass rounded-2xl p-6 shadow-soft">
      <div
        role="button"
        tabIndex={0}
        onClick={onPick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onPick();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center transition',
          dragging && 'border-brand/60 bg-brand/10',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Upload className="h-5 w-5 text-white/75" />
        </div>
        <div className="mt-4 font-medium text-white">Drag & drop files here</div>
        <div className="mt-1 text-sm text-white/60">or click to browse</div>
        <div className="mt-3 text-xs text-white/50">{accept ? `Accepted: ${accept}` : ''}</div>
      </div>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          if (!list.length) return;
          onFilesChange(multiple ? list : [list[0]]);
        }}
      />

      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          {files.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <FileIcon className="h-4.5 w-4.5 text-white/70" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{f.name}</div>
                  <div className="text-xs text-white/60">{formatBytes(f.size)}</div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove file"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onFilesChange(files.filter((_, i) => i !== idx));
                }}
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

