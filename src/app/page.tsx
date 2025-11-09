import { ProfileHeader } from '@/components/profile-header';
import { PostCard } from '@/components/post-card';
import { posts, siteConfig } from '@/lib/config';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12 lg:py-16">
        <div className="space-y-16">
          <ProfileHeader />

          <section className="space-y-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Posts
            </h2>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p>No posts yet. Check back later!</p>
            )}
          </section>
        </div>
      </main>
      <footer className="w-full border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
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
        <p>
          Discoverable on the Fediverse as{' '}
          <code className="font-mono">
            @{siteConfig.author.handle}@{new URL(siteConfig.url).hostname}
          </code>
        </p>
      </footer>
    </div>
  );
}
