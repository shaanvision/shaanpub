import { siteConfig } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="https://raw.githubusercontent.com/shaanvision/shaanpub/db5bf0ecea1a2da4129848675bb30ff69e249289/shaanpub-maskot.svg"
            alt="ShaanPub Mascot"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="font-headline text-2xl font-bold">
            {siteConfig.name}
          </span>
        </Link>
      </div>
    </header>
  );
}
