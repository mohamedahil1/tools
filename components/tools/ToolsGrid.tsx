'use client';

import { motion } from 'framer-motion';

import type { ToolDefinition } from '@/lib/tools/types';
import { ToolCard } from '@/components/tools/ToolCard';

export function ToolsGrid({ tools }: { tools: ToolDefinition[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } }
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {tools.map((t) => (
        <motion.div
          key={t.slug}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
          }}
        >
          <ToolCard tool={t} />
        </motion.div>
      ))}
    </motion.div>
  );
}

