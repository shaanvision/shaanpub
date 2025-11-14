'use client';

import { siteConfig } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';
import { SiGithub, SiGitlab, SiLinkedin, SiX } from 'react-icons/si';
import { Globe } from 'lucide-react';

type ProfileHeaderProps = {
  user?: (typeof siteConfig.users)[number];
};

const iconMap: { [key: string]: React.ElementType } = {
  github: SiGithub,
  gitlab: SiGitlab,
  linkedin: SiLinkedin,
  x: SiX,
  website: Globe,
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const currentUser = user || siteConfig.author;
  const domain = new URL(siteConfig.url).hostname;

  return (
    <header className="relative flex flex-col items-center rounded-2xl bg-card p-8 shadow-2xl shadow-black/[.05] ring-1 ring-border/50">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/50 to-primary/20 rounded-t-2xl" />
      <div className="relative mt-16 flex w-full flex-col items-center space-y-6 md:flex-row md:space-x-8 md:space-y-0">
        <div className="relative h-32 w-32 shrink-0 md:h-40 md:w-40">
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            width={160}
            height={160}
            className="rounded-full ring-4 ring-background"
            priority
          />
        </div>
        <div className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left">
          <div className="space-y-2">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              {currentUser.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              @{currentUser.handle}@{domain}
            </p>
          </div>
          <div
            className="prose max-w-none text-pretty text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: currentUser.bio }}
          />
        </div>
      </div>
      {currentUser.links && currentUser.links.length > 0 && (
        <div className="flex w-full flex-wrap justify-center gap-4 pt-6 md:justify-start">
          {currentUser.links.map((link) => {
            const Icon = iconMap[link.label.toLowerCase()] || Globe;
            return (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
