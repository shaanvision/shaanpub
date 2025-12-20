// src/components/post-card.tsx
import type { Post } from '@/lib/config';
import { format } from 'date-fns';
import Link from 'next/link';
import { config } from '@/lib/config';
import { Tag } from 'lucide-react';

export function PostCard({ post }: { post: Post }) {
  const author = config.users.find((u) => u.handle === post.authorHandle);
  if (!author) return null;

  return (
    <article
      className="group relative flex flex-col rounded-2xl bg-card text-card-foreground shadow-lg ring-1 ring-border/50 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="flex h-full flex-col p-6">
        <h2 className="font-headline text-2xl font-bold leading-snug">
          <Link
            href={`/@${author.handle}/posts/${post.slug}`}
            className="text-primary transition-colors duration-300 ease-in-out group-hover:text-primary/80"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {format(new Date(post.published), 'MMMM d, yyyy')}
        </p>

        <div
          className="prose mt-4 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-auto pt-6 flex flex-wrap gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm font-medium text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </article>
  );
}
