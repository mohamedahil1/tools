'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clapperboard,
  Combine,
  FileImage,
  FileType2,
  FileVideo,
  Film,
  ImageDown,
  Images,
  KeyRound,
  QrCode,
  Scissors,
  Shrink,
  Split,
  TextQuote
} from 'lucide-react';

import { cn } from '@/lib/cn';
import type { ToolDefinition } from '@/lib/tools/types';

const iconMap = {
  Clapperboard,
  Combine,
  FileImage,
  FileType2,
  FileVideo,
  Film,
  ImageDown,
  Images,
  KeyRound,
  QrCode,
  Scissors,
  Shrink,
  Split,
  TextQuote
} as const;

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = iconMap[tool.icon as keyof typeof iconMap] ?? FileImage;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="h-full"
    >
      <Link
        href={tool.href}
        className={cn(
          'group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-5',
          'glass shadow-soft transition',
          'hover:glow-border'
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute -inset-24 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.30),transparent_55%)]" />
          <div className="absolute -inset-24 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.10),transparent_55%)]" />
        </div>

        <div className="relative flex items-start justify-between gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className="h-5 w-5 text-white/85" />
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
            {tool.category}
          </div>
        </div>

        <div className="relative">
          <div className="text-base font-semibold tracking-tight text-white">{tool.title}</div>
          <div className="mt-1 text-sm text-white/65">{tool.description}</div>
        </div>

        <div className="relative mt-auto text-xs text-white/50">
          Click to open <span className="text-white/70 transition group-hover:text-white">→</span>
        </div>
      </Link>
    </motion.div>
  );
}

