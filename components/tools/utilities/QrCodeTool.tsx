'use client';

import * as React from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function QrCodeTool({ title, description }: { title: string; description: string }) {
  const [text, setText] = React.useState('https://example.com');
  const [size, setSize] = React.useState(720);
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDataUrl(null);
    setError(null);
  }, [text, size]);

  const generate = async () => {
    try {
      setError(null);
      const url = await QRCode.toDataURL(text.trim() || ' ', {
        width: size,
        margin: 2,
        color: { dark: '#E2E8F0', light: '#0F172A' }
      });
      setDataUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate QR code.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-white/65">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="glass rounded-2xl p-6 shadow-soft">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Text or URL</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-brand/60"
              placeholder="https://..."
            />
          </label>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Size (px)</span>
              <input
                type="number"
                min={128}
                max={2048}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-brand/60"
              />
            </label>

            <div className="flex items-end">
              <Button type="button" size="lg" className="w-full" onClick={generate}>
                <QrCode className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>

          {error && <div className="mt-4 text-sm text-red-200/90">{error}</div>}
        </div>

        <div className="glass rounded-2xl p-6 shadow-soft">
          <div className="text-sm font-medium text-white">Preview</div>
          <div className="mt-4 grid place-items-center rounded-2xl border border-white/10 bg-white/5 p-4">
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="QR code" className="h-auto w-full max-w-[260px]" />
            ) : (
              <div className="text-sm text-white/55">Click Generate to preview.</div>
            )}
          </div>

          {dataUrl && (
            <div className="mt-4">
              <Button asChild className="w-full">
                <a href={dataUrl} download="qr-code.png">
                  <Download className="h-4 w-4" />
                  Download PNG
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

