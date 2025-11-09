import { siteConfig, posts } from './config';
import type { Post } from './config';

const baseUrl = siteConfig.url;
const userUrl = `${baseUrl}/ap/actor`;
const domain = new URL(baseUrl).hostname;

export function getActor() {
  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1',
    ],
    id: userUrl,
    type: 'Person',
    name: siteConfig.author.name,
    preferredUsername: siteConfig.author.handle,
    summary: `<p>${siteConfig.author.bio}</p>`,
    inbox: `${baseUrl}/ap/inbox`,
    outbox: `${baseUrl}/ap/outbox`,
    followers: `${baseUrl}/ap/followers`,
    following: `${baseUrl}/ap/following`,
    icon: {
      type: 'Image',
      mediaType: 'image/png',
      url: siteConfig.author.avatar,
    },
    image: {
      type: 'Image',
      mediaType: 'image/png',
      url: siteConfig.author.avatar,
    },
    endpoints: {
      sharedInbox: `${baseUrl}/ap/inbox`,
    },
    attachment: siteConfig.author.links.map((link) => ({
      type: 'PropertyValue',
      name: link.label,
      value: `<a href="${link.href}" target="_blank" rel="me nofollow noopener noreferrer">${link.href}</a>`,
    })),
  };
}

export function getOutbox() {
  const orderedItems = posts.map((post) => createCreateActivity(post));

  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${baseUrl}/ap/outbox`,
    type: 'OrderedCollection',
    totalItems: posts.length,
    orderedItems: orderedItems,
  };
}

export function getNoteObject(post: Post) {
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  return {
    id: `${postUrl}`,
    type: 'Note',
    published: post.published,
    attributedTo: userUrl,
    content: post.content,
    url: postUrl,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: [`${baseUrl}/ap/followers`],
    tag: [],
  };
}

export function createCreateActivity(post: Post) {
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  return {
    id: `${postUrl}#activity`,
    type: 'Create',
    actor: userUrl,
    published: post.published,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: [`${baseUrl}/ap/followers`],
    object: getNoteObject(post),
  };
}

export function getWebFinger() {
  return {
    subject: `acct:${siteConfig.author.handle}@${domain}`,
    aliases: [userUrl, baseUrl],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
        href: baseUrl,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: userUrl,
      },
    ],
  };
}

export function getHostMeta() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" type="application/jrd+json" template="${baseUrl}/.well-known/webfinger?resource={uri}" />
</XRD>`;
}

export function getNodeInfo() {
    return {
        links: [
            {
                rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
                href: `${baseUrl}/ap/nodeinfo`,
            },
        ],
    };
}

export function getNodeInfoJson() {
    return {
        version: '2.0',
        software: { name: 'ShaanPub', version: '1.0.0' },
        protocols: ['activitypub'],
        usage: { users: { total: 1 }, localPosts: posts.length },
        openRegistrations: false,
        metadata: {},
    };
}

export function getFollowers() {
    return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${baseUrl}/ap/followers`,
        type: 'OrderedCollection',
        totalItems: 0,
        orderedItems: [],
    };
}

export function getFollowing() {
    return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${baseUrl}/ap/following`,
        type: 'OrderedCollection',
        totalItems: 0,
        orderedItems: [],
    };
}

export function getInboxPost() {
    return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${baseUrl}/ap/inbox`,
        type: 'OrderedCollection',
        totalItems: 0,
        orderedItems: [],
    };
}
