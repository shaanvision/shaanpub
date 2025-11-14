import config from '../../config.json' assert { type: 'json' };
import postsData from '../../posts.json' assert { type: 'json' };

export const siteConfig = {
  name: config.name,
  url: config.url,
  ogImage: config.ogImage,
  description: config.description,
  users: config.users,
  author: config.users[0],
} as const;

// Replace placeholders in post content
const domain = new URL(siteConfig.url).hostname;
export const posts = postsData.posts.map((post) => {
  const author = siteConfig.users.find(u => u.handle === post.authorHandle);
  return {
    ...post,
    content: post.content
      .replace(/{{handle}}/g, author?.handle || '')
      .replace(/{{domain}}/g, domain),
  }
});

export type SiteConfig = typeof siteConfig;
export type Post = (typeof posts)[number];
