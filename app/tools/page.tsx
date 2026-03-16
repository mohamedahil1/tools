import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { toolsRegistry } from '@/lib/tools/toolsRegistry';

export const dynamic = 'force-dynamic';

export default function ToolsIndexPage() {
  return (
    <div className="min-h-dvh bg-surface-bg text-ink">
      <div className="pointer-events-none fixed inset-0 noise-bg opacity-[0.18]" />
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">All tools</h1>
        <p className="mt-2 text-sm text-white/65">
          Pick a tool below. Each tool is modular and registered in one place.
        </p>

        <div className="mt-8">
          <ToolsGrid tools={toolsRegistry} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

