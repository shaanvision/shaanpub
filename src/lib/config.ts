// src/lib/config.ts
import configData from '../../config.json';
import postsData from '../../posts.json';

export interface Link {
  label: string;
  href: string;
}

export interface User {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  published: string;
  links: Link[];
}

export interface Attachment {
    type?: "Image" | "Video" | "Audio" | "Link";
    mediaType: string;
    url: string;
    name?: string | null;
}

export interface Post {
    slug: string;
    title: string;
    authorHandle: string;
    published: string;
    sensitive: boolean;
    content: string;
    tags: string[];
    attachments: Attachment[];
}

interface Config {
  name: string;
  url: string;
  ogImage: string;
  description: string;
  users: User[];
}

interface Posts {
    posts: Post[];
}

export const config: Config = configData;
export const posts: Posts = postsData as Posts;

export const site = {
    name: config.name,
    url: config.url,
    ogImage: config.ogImage,
    description: config.description,
    author: config.users[0]?.name,
    authorHandle: config.users[0]?.handle,
}
