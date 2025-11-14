import { siteConfig, posts } from '@/lib/config';
import { ProfileHeader } from '@/components/profile-header';
import { PostCard } from '@/components/post-card';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return siteConfig.users.map((user) => ({
    handle: user.handle,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const user = siteConfig.users.find((u) => u.handle === handle);
  if (!user) {
    return {};
  }
  return {
    title: `${user.name}'s Profile`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const user = siteConfig.users.find((u) => u.handle === handle);
  const userPosts = posts.filter((p) => p.authorHandle === handle);

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12 lg:py-16">
        <div className="space-y-16">
          <ProfileHeader user={user} />

          <section className="space-y-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Posts
            </h2>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {userPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p>No posts yet. Check back later!</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
