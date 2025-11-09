import type { Post } from '@/lib/config';
import { format } from 'date-fns';
import Link from 'next/link';

export function PostCard({ post }: { post: Post }) {
  // Create a short preview of the content, stripped of HTML
  const preview = post.content.replace(/<[^>]*>?/gm, '').substring(0, 100);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex h-full flex-col overflow-hidden p-6">
        <h2 className="font-headline text-xl leading-snug group-hover:text-primary">
          {post.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(new Date(post.published), 'MMMM d, yyyy')}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">{preview}...</p>
      </div>
    </Link>
  );
}
