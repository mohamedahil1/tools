import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-surface-bg text-ink">
      <div className="pointer-events-none fixed inset-0 noise-bg opacity-[0.18]" />
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6">
        <div className="glass rounded-2xl p-6 shadow-soft">
          <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
          <p className="mt-3 text-sm text-white/70">
            Files are stored temporarily for processing and deleted automatically after a short TTL.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

