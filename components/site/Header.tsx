'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Moon, SunMedium, Wrench } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const nav = [
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' }
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-bg/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5 transition group-hover:glow-border">
            <Wrench className="h-4.5 w-4.5 text-white/80" />
          </span>
          <span className="font-semibold tracking-tight">Tools</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Button key={item.href} asChild variant={active ? 'secondary' : 'ghost'} size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Moon className="h-4.5 w-4.5" /> : <SunMedium className="h-4.5 w-4.5" />}
          </Button>

          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="h-4.5 w-4.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

