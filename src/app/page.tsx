import { siteConfig } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const domain = new URL(siteConfig.url).hostname;
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12 lg:py-16">
        <div className="space-y-8 text-center">
          <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl">
            Welcome to {siteConfig.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <section className="mt-24 space-y-12">
          <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl text-center">
            Our Users
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {siteConfig.users.map((user) => (
              <Link href={`/@${user.handle}`} key={user.handle}>
                <div className="group flex flex-col items-center space-y-6 rounded-2xl bg-card p-8 text-center shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-28 w-28">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={112}
                      height={112}
                      className="rounded-full ring-4 ring-background transition-all duration-300 ease-in-out group-hover:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline text-2xl font-bold">{user.name}</h3>
                    <p className="text-md text-muted-foreground">
                      @{user.handle}@{domain}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
