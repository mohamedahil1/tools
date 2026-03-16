'use client';

import * as React from 'react';
import { AlertTriangle, Wand2 } from 'lucide-react';

import type { ToolDefinition } from '@/lib/tools/types';
import { Dropzone } from '@/components/upload/Dropzone';
import { ProcessingState } from '@/components/processing/ProcessingState';
import { Button } from '@/components/ui/button';
import { useToolUpload } from '@/hooks/useToolUpload';
import { QrCodeTool } from '@/components/tools/utilities/QrCodeTool';
import { PasswordGeneratorTool } from '@/components/tools/utilities/PasswordGeneratorTool';
import { WordCounterTool } from '@/components/tools/utilities/WordCounterTool';

type Options = Record<string, unknown>;

function NumberField({
  label,
  value,
  onChange,
  min,
  max
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-brand/60"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-brand/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToolRunner({ tool }: { tool: ToolDefinition }) {
  if (tool.slug === 'qr-code-generator') {
    return <QrCodeTool title={tool.title} description={tool.description} />;
  }
  if (tool.slug === 'password-generator') {
    return <PasswordGeneratorTool title={tool.title} description={tool.description} />;
  }
  if (tool.slug === 'word-counter') {
    return <WordCounterTool title={tool.title} description={tool.description} />;
  }

  const [files, setFiles] = React.useState<File[]>([]);
  const [options, setOptions] = React.useState<Options>({});
  const { run, isProcessing, result, error, progress } = useToolUpload(tool.slug);

  React.useEffect(() => {
    setFiles([]);
    setOptions({});
  }, [tool.slug]);

  const canRun = tool.kind === 'utility' ? true : files.length > 0;

  const multiple = tool.slug === 'merge-pdf';

  const renderOptions = () => {
    if (tool.kind !== 'file') return null;
    switch (tool.slug) {
      case 'image-resizer':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              label="Width"
              value={(options.width as number) ?? 1200}
              onChange={(n) => setOptions((o) => ({ ...o, width: n }))}
              min={1}
              max={10000}
            />
            <NumberField
              label="Height"
              value={(options.height as number) ?? 1200}
              onChange={(n) => setOptions((o) => ({ ...o, height: n }))}
              min={1}
              max={10000}
            />
          </div>
        );
      case 'image-converter':
        return (
          <SelectField
            label="Format"
            value={(options.format as string) ?? 'webp'}
            onChange={(v) => setOptions((o) => ({ ...o, format: v }))}
            options={[
              { label: 'WebP', value: 'webp' },
              { label: 'JPG', value: 'jpg' },
              { label: 'PNG', value: 'png' }
            ]}
          />
        );
      case 'image-compressor':
        return (
          <NumberField
            label="Quality (1-100)"
            value={(options.quality as number) ?? 75}
            onChange={(n) => setOptions((o) => ({ ...o, quality: n }))}
            min={1}
            max={100}
          />
        );
      case 'video-trimmer':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              label="Start (seconds)"
              value={(options.start as number) ?? 0}
              onChange={(n) => setOptions((o) => ({ ...o, start: n }))}
              min={0}
            />
            <NumberField
              label="Duration (seconds)"
              value={(options.duration as number) ?? 5}
              onChange={(n) => setOptions((o) => ({ ...o, duration: n }))}
              min={1}
            />
          </div>
        );
      case 'video-to-gif':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              label="Start (seconds)"
              value={(options.start as number) ?? 0}
              onChange={(n) => setOptions((o) => ({ ...o, start: n }))}
              min={0}
            />
            <NumberField
              label="Duration (seconds)"
              value={(options.duration as number) ?? 5}
              onChange={(n) => setOptions((o) => ({ ...o, duration: n }))}
              min={1}
              max={60}
            />
          </div>
        );
      case 'video-converter':
        return (
          <SelectField
            label="Format"
            value={(options.format as string) ?? 'mp4'}
            onChange={(v) => setOptions((o) => ({ ...o, format: v }))}
            options={[
              { label: 'MP4', value: 'mp4' },
              { label: 'WEBM', value: 'webm' },
              { label: 'MOV', value: 'mov' }
            ]}
          />
        );
      case 'video-compressor':
        return (
          <NumberField
            label="CRF (lower = higher quality)"
            value={(options.crf as number) ?? 28}
            onChange={(n) => setOptions((o) => ({ ...o, crf: n }))}
            min={18}
            max={40}
          />
        );
      default:
        return (
          <div className="text-sm text-white/60">
            No options required for this tool.
          </div>
        );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{tool.title}</h1>
          <p className="mt-2 text-sm text-white/65">{tool.description}</p>
        </div>

        {tool.kind === 'file' ? (
          <Dropzone
            accept={tool.accept}
            multiple={multiple}
            files={files}
            onFilesChange={setFiles}
            disabled={isProcessing}
          />
        ) : null}

        <div className="glass rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-white">Options</div>
              <div className="mt-1 text-xs text-white/50">
                Upload progress: {progress}%
              </div>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={() => run({ files, options })}
              disabled={!canRun || isProcessing}
            >
              <Wand2 className="h-4 w-4" />
              Convert
            </Button>
          </div>

          <div className="mt-4">{renderOptions()}</div>

          {tool.kind === 'file' && files.length === 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-white/50" />
              Add a file above to enable processing.
            </div>
          )}
        </div>

        <ProcessingState isProcessing={isProcessing} result={result} error={error} />
      </div>

      <aside className="hidden lg:block">
        <div className="glass sticky top-24 rounded-2xl p-6 shadow-soft">
          <div className="text-sm font-medium text-white">How it works</div>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-white/65">
            <li>Upload a file (or use a utility tool).</li>
            <li>Pick options.</li>
            <li>Process and download the result.</li>
          </ol>
          <div className="mt-4 text-xs text-white/50">
            Files are stored temporarily and cleaned up automatically.
          </div>
        </div>
      </aside>
    </div>
  );
}

