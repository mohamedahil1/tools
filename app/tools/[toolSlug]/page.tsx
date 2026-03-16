import { notFound } from 'next/navigation';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ToolRunner } from '@/components/tools/ToolRunner';
import { getTool } from '@/lib/tools/toolsRegistry';

export const dynamic = 'force-dynamic';

export default function ToolPage({ params }: { params: { toolSlug: string } }) {
  const tool = getTool(params.toolSlug);
  if (!tool) return notFound();

  return (
    <div className="min-h-dvh bg-surface-bg text-ink">
      <div className="pointer-events-none fixed inset-0 noise-bg opacity-[0.18]" />
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <ToolRunner tool={tool} />
      </main>

      <Footer />
    </div>
  );
}

