// src/components/header.tsx
import { config } from '@/lib/config';
import Link from 'next/link';
import { Home } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-bold">{config.name}</span>
        </Link>
        <nav className="flex items-center space-x-4">
          {/* Add nav links here if needed */}
        </nav>
      </div>
    </header>
  );
}
