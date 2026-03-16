import Link from 'next/link';

import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { Button } from '@/components/ui/button';
import { toolsRegistry } from '@/lib/tools/toolsRegistry';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[color:var(--bg,#0F172A)] text-ink">
      <div className="pointer-events-none fixed inset-0 noise-bg opacity-[0.18]" />
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 shadow-soft sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_0%,rgba(99,102,241,0.35),transparent_70%)]" />
          <div className="relative">
            <p className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Fast · Minimal · Modular
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              All your file tools in one place
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-sm text-white/70 sm:text-base">
              Compress, convert, edit and generate files instantly in your browser.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-soft">
                <Link href="#tools">Start Using Tools</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tools">View All Tools</Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {toolsRegistry.slice(0, 4).map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="glass rounded-2xl px-4 py-3 text-xs text-white/70 transition hover:glow-border"
                >
                  <div className="font-medium text-white">{t.title}</div>
                  <div className="mt-1 line-clamp-1">{t.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="tools" className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Tools</h2>
              <p className="mt-1 text-sm text-white/60">
                {toolsRegistry.length} tools ready. New tools can be added in minutes.
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/tools">Browse all</Link>
            </Button>
          </div>

          <ToolsGrid tools={toolsRegistry} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

