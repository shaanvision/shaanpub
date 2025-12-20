// src/lib/activitypub.ts
import { config, posts } from "./config";
import type { User, Post, Link as UserLink } from "./config";

const BASE_URL = config.url;
const DOMAIN = new URL(BASE_URL).hostname;

export function generateWebFinger(user: User) {
  return {
    subject: `acct:${user.handle}@${DOMAIN}`,
    aliases: [
      `${BASE_URL}/@${user.handle}`,
      `${BASE_URL}/users/${user.handle}.json`,
    ],
    links: [
      {
        rel: "http://webfinger.net/rel/profile-page",
        type: "text/html",
        href: `${BASE_URL}/@${user.handle}`,
      },
      {
        rel: "self",
        type: "application/activity+json",
        href: `${BASE_URL}/users/${user.handle}.json`,
      },
    ],
  };
}

export async function generateActor(
  user: User & { header?: string },
  publicKey: string
) {
  return {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/v1",
      {
        manuallyApprovesFollowers: "as:manuallyApprovesFollowers",
        toot: "http://joinmastodon.org/ns#",
        featured: { "@id": "toot:featured", "@type": "@id" },
        discoverable: "toot:discoverable",
        schema: "http://schema.org#",
        PropertyValue: "schema:PropertyValue",
        value: "schema:value",
      },
    ],
    id: `${BASE_URL}/users/${user.handle}.json`,
    type: "Person",
    name: user.name,
    preferredUsername: user.handle,
    summary: user.bio,
    inbox: `${BASE_URL}/users/${user.handle}/inbox.json`,
    outbox: `${BASE_URL}/users/${user.handle}/outbox.json`,
    followers: `${BASE_URL}/users/${user.handle}/followers.json`,
    following: `${BASE_URL}/users/${user.handle}/following.json`,
    featured: `${BASE_URL}/users/${user.handle}/featured.json`,
    icon: { type: "Image", mediaType: "image/png", url: user.avatar },
    image: { type: "Image", mediaType: "image/png", url: user.header || user.avatar },
    publicKey: {
      id: `${BASE_URL}/users/${user.handle}.json#main-key`,
      owner: `${BASE_URL}/users/${user.handle}.json`,
      publicKeyPem: publicKey,
    },
    attachment: user.links.map((link: UserLink) => ({
      type: "PropertyValue",
      name: link.label,
      value: `<a href="${link.href}" rel="me nofollow noopener noreferrer" target="_blank">${link.href}</a>`,
    })),
    manuallyApprovesFollowers: true,
    discoverable: true,
    published: user.published,
  };
}

export function emptyCollection(id: string) {
    return { "@context": "https://www.w3.org/ns/activitystreams", id, type: "OrderedCollection", totalItems: 0, orderedItems: [] };
}

export function generateFeaturedCollection(user: User & { featured?: string[] }) {
    const allPosts = posts.posts;
    const featuredPosts = (user.featured || [])
        .map(slug => allPosts.find(p => p.slug === slug && p.authorHandle === user.handle))
        .filter(Boolean) // Remove any not found
        .map(post => `${config.url}/users/${user.handle}/posts/${post!.slug}.json`);

    return {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: `${config.url}/users/${user.handle}/featured.json`,
        type: "OrderedCollection",
        totalItems: featuredPosts.length,
        orderedItems: featuredPosts,
    };
}

export function generateOutbox(user: User) {
  const userPosts = posts.posts.filter((p) => p.authorHandle === user.handle);
  const items = userPosts.map((post: Post) => ({
    id: `${BASE_URL}/users/${user.handle}/posts/${post.slug}.json#activity`,
    type: "Create",
    actor: `${BASE_URL}/users/${user.handle}.json`,
    published: post.published,
    to: ["https://www.w3.org/ns/activitystreams#Public"],
    cc: [`${BASE_URL}/users/${user.handle}/followers.json`],
    object: `${BASE_URL}/users/${user.handle}/posts/${post.slug}.json`,
  }));
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${BASE_URL}/users/${user.handle}/outbox.json`,
    type: "OrderedCollection",
    totalItems: userPosts.length,
    orderedItems: items.sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    ),
  };
}

export async function generatePostJson(user: User, post: Post) {
  const postTags = (post.tags || []).map((tag: string) => ({
    type: "Hashtag",
    name: `#${tag}`,
    href: `${BASE_URL}/tags/${tag.toLowerCase()}`,
  }));

  const postAttachments = (post.attachments || []).map((att) => ({
    type: att.type || "Image",
    mediaType: att.mediaType,
    url: att.url,
    name: att.name || null,
  }));

  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${BASE_URL}/users/${user.handle}/posts/${post.slug}.json`,
    type: "Note",
    published: post.published,
    attributedTo: `${BASE_URL}/users/${user.handle}.json`,
    content: post.content,
    url: `${BASE_URL}/@${user.handle}/posts/${post.slug}`,
    to: ["https://www.w3.org/ns/activitystreams#Public"],
    cc: [`${BASE_URL}/users/${user.handle}/followers.json`],
    sensitive: post.sensitive || false,
    tag: postTags,
    attachment: postAttachments,
  };
}
