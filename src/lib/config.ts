import config from '../../config.json' assert { type: 'json' };
import postsData from '../../posts.json' assert { type: 'json' };

export const siteConfig = {
  name: config.name,
  url: config.url,
  ogImage: config.ogImage,
  description: config.description,
  author: {
    name: config.author.name,
    handle: config.author.handle,
    bio: config.author.bio,
    avatar: config.author.avatar,
    links: config.author.links,
  },
} as const;

// Replace placeholders in post content
const domain = new URL(siteConfig.url).hostname;
export const posts = postsData.posts.map((post) => ({
  ...post,
  content: post.content
    .replace(/{{handle}}/g, siteConfig.author.handle)
    .replace(/{{domain}}/g, domain),
}));

export type SiteConfig = typeof siteConfig;
export type Post = (typeof posts)[number];
