import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p>
            ShaanPub by{' '}
            <a
              href="https://www.shaanvision.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-primary"
            >
              Shaan Vision
            </a>
            .
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shaanvision/shaanpub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-primary"
            >
              Source Code
            </a>
            <a
              href="https://github.com/shaanvision/shaanpub/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-primary"
            >
              Forum
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
