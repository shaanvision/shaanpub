import type { Post } from '@/lib/config';
import { format } from 'date-fns';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export function PostCard({ post }: { post: Post }) {
  const preview = post.content.replace(/<[^>]*>?/gm, '').substring(0, 150);
  const author = siteConfig.users.find((u) => u.handle === post.authorHandle);

  return (
    <Link
      href={`/@${author?.handle}/posts/${post.slug}`}
      className="group block rounded-2xl border bg-card text-card-foreground shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="flex h-full flex-col overflow-hidden p-6">
        <h2 className="font-headline text-2xl leading-snug transition-colors duration-300 ease-in-out group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {format(new Date(post.published), 'MMMM d, yyyy')}
        </p>
        <p className="mt-4 text-md text-muted-foreground">{preview}...</p>
      </div>
    </Link>
  );
}
