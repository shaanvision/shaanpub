import { posts, siteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { ProfileHeader } from '@/components/profile-header';
import Link from 'next/link';

export async function generateStaticParams() {
  const params = posts.map((post) => ({
    handle: post.authorHandle,
    slug: post.slug,
  }));
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string, slug: string }>;
}): Promise<Metadata> {
  const { handle, slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  const user = siteConfig.users.find((u) => u.handle === handle);


  if (!post || !user) {
    return {};
  }

  return {
    title: post.title,
    description: 'A post from my static Fediverse profile.',
    openGraph: {
      title: post.title,
      description: 'A post from my static Fediverse profile.',
      url: `${siteConfig.url}/@${handle}/posts/${slug}`,
      type: 'article',
      publishedTime: post.published,
      authors: [user.name],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ handle: string, slug: string }>;
}) {
  const { handle, slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  const user = siteConfig.users.find((u) => u.handle === handle);

  if (!post || !user) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12 lg:py-16">
        <div className="space-y-12">
          <ProfileHeader user={user} />
          <article className="prose prose-lg mx-auto dark:prose-invert">
            <header className="mb-8 border-b pb-4">
              <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Published on {format(new Date(post.published), 'MMMM d, yyyy')}
              </p>
            </header>
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>
      <footer className="w-full border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        <p>
          <Link
            href={`/@${handle}`}
            className="underline transition-colors hover:text-primary"
          >
            &larr; Back to profile
          </Link>
        </p>
      </footer>
    </div>
  );
}
