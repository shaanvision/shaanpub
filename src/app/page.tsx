// src/app/page.tsx
import { config } from '@/lib/config';
import type { User } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const users = config.users;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 animate-fade-in">
      <main className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl">
          Welcome to <span className="text-primary">{config.name}</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {config.description}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {users.map((user: User) => (
            <Link
              key={user.handle}
              href={`/@${user.handle}`}
              className="group flex flex-col items-center space-y-4 rounded-2xl bg-card p-8 text-card-foreground shadow-lg ring-1 ring-border/50 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
            >
              <Image
                src={user.avatar}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full ring-4 ring-background"
              />
              <div className="text-center">
                <h2 className="font-headline text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">@{user.handle}</p>
              </div>
              <div className="flex items-center text-sm text-primary transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                <span>View Profile</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
