// src/components/footer.tsx
import { config } from '@/lib/config';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
        </p>
        <p className="mt-2">
          Powered by{' '}
          <Link
            href="https://github.com/shaanvision/shaanpub"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ShaanPub
          </Link>
        </p>
      </div>
    </footer>
  );
}
