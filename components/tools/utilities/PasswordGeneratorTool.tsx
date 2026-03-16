'use client';

import * as React from 'react';
import { Copy, KeyRound, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

function buildCharset(opts: {
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}) {
  let s = 'abcdefghijklmnopqrstuvwxyz';
  if (opts.uppercase) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.numbers) s += '0123456789';
  if (opts.symbols) s += '!@#$%^&*()-_=+[]{};:,.?/|~';
  return s;
}

function randomPassword(length: number, charset: string) {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) out += charset[bytes[i] % charset.length];
  return out;
}

export function PasswordGeneratorTool({ title, description }: { title: string; description: string }) {
  const [length, setLength] = React.useState(16);
  const [uppercase, setUppercase] = React.useState(true);
  const [numbers, setNumbers] = React.useState(true);
  const [symbols, setSymbols] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const generate = React.useCallback(() => {
    const charset = buildCharset({ uppercase, numbers, symbols });
    const len = Math.min(128, Math.max(6, Math.round(length)));
    setValue(randomPassword(len, charset));
    setCopied(false);
  }, [length, uppercase, numbers, symbols]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-white/65">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="glass rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-white">Options</div>
            <Button type="button" variant="secondary" onClick={generate}>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Length</span>
              <input
                type="number"
                min={6}
                max={128}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-brand/60"
              />
            </label>

            <div className="grid gap-2 text-sm">
              <span className="text-white/70">Include</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                  />
                  Uppercase
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={numbers}
                    onChange={(e) => setNumbers(e.target.checked)}
                  />
                  Numbers
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={symbols}
                    onChange={(e) => setSymbols(e.target.checked)}
                  />
                  Symbols
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-white">Generated password</div>
            <Button type="button" variant="ghost" onClick={copy}>
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white">
              <KeyRound className="h-4 w-4 text-white/70" />
              <code className="break-all text-sm">{value}</code>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/50">
            Uses secure randomness from your browser.
          </div>
        </div>
      </div>
    </div>
  );
}

