'use client';

import * as React from 'react';
import { TextQuote } from 'lucide-react';

function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function readingTimeMinutes(words: number) {
  const wpm = 220;
  return Math.max(1, Math.round(words / wpm));
}

export function WordCounterTool({ title, description }: { title: string; description: string }) {
  const [text, setText] = React.useState('');

  const words = React.useMemo(() => countWords(text), [text]);
  const characters = React.useMemo(() => text.length, [text]);
  const minutes = React.useMemo(() => (words ? readingTimeMinutes(words) : 0), [words]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-white/65">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="glass rounded-2xl p-6 shadow-soft">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Text</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[220px] resize-y rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-brand/60"
              placeholder="Paste or type your text..."
            />
          </label>
        </div>

        <div className="glass rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <TextQuote className="h-4 w-4 text-white/70" />
            Stats
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Words</div>
              <div className="mt-1 text-2xl font-semibold text-white">{words}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Characters</div>
              <div className="mt-1 text-2xl font-semibold text-white">{characters}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Reading time</div>
              <div className="mt-1 text-2xl font-semibold text-white">
                {minutes ? `${minutes} min` : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

