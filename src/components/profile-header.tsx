'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export function ProfileHeader() {
  return (
    <header className="p-4 sm:p-6 md:p-8">
      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:text-left">
          <Image
            src={siteConfig.author.avatar}
            alt={siteConfig.author.name}
            width={128}
            height={128}
            className="h-24 w-24 rounded-full border-4 border-background shadow-md md:h-32 md:w-32"
          />
          <div className="flex-1 space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">
              {siteConfig.author.name}
            </h1>
            <p className="text-base text-muted-foreground">
              {siteConfig.author.bio}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 border-t p-4 md:justify-start">
          {siteConfig.author.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
