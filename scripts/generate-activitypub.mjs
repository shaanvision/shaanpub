import fs from 'fs';
import path from 'path';
import config from '../config.json' assert { type: 'json' };
import postsData from '../src/lib/posts.json' assert { type: 'json' };

const siteConfig = {
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
};

const domain = new URL(siteConfig.url).hostname;
const posts = postsData.posts.map((post) => ({
  ...post,
  content: post.content
    .replace(/{{handle}}/g, siteConfig.author.handle)
    .replace(/{{domain}}/g, domain),
}));

// Re-implementing functions from lib/activitypub.ts here in pure JS
const baseUrl = siteConfig.url;
const userUrl = `${baseUrl}/ap/actor.json`;

function getActor() {
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
    inbox: `${baseUrl}/ap/inbox.json`,
    outbox: `${baseUrl}/ap/outbox.json`,
    followers: `${baseUrl}/ap/followers.json`,
    following: `${baseUrl}/ap/following.json`,
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
      sharedInbox: `${baseUrl}/ap/inbox.json`,
    },
    attachment: siteConfig.author.links.map((link) => ({
      type: 'PropertyValue',
      name: link.label,
      value: `<a href="${link.href}" target="_blank" rel="me nofollow noopener noreferrer">${link.href}</a>`,
    })),
  };
}

function createCreateActivity(post) {
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  return {
    id: `${postUrl}#activity`,
    type: 'Create',
    actor: userUrl,
    published: post.published,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: [`${baseUrl}/ap/followers.json`],
    object: {
      id: `${postUrl}`,
      type: 'Note',
      published: post.published,
      attributedTo: userUrl,
      content: post.content,
      url: postUrl,
      to: ['https://www.w3.org/ns/activitystreams#Public'],
      cc: [`${baseUrl}/ap/followers.json`],
      tag: [],
    },
  };
}

function getOutbox() {
  const orderedItems = posts.map((post) => createCreateActivity(post));

  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${baseUrl}/ap/outbox.json`,
    type: 'OrderedCollection',
    totalItems: posts.length,
    orderedItems: orderedItems,
  };
}

function getWebFinger() {
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

function getHostMeta() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" type="application/jrd+json" template="${baseUrl}/.well-known/webfinger?resource={uri}" />
</XRD>`;
}

function getNodeInfo() {
  return {
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: `${baseUrl}/ap/nodeinfo.json`,
      },
    ],
  };
}

function getNodeInfoJson() {
  return {
    version: '2.0',
    software: { name: 'ShaanPub', version: '1.0.0' },
    protocols: ['activitypub'],
    usage: { users: { total: 1 }, localPosts: posts.length },
    openRegistrations: false,
    metadata: {},
  };
}

function getFollowers() {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${baseUrl}/ap/followers.json`,
    type: 'OrderedCollection',
    totalItems: 0,
    orderedItems: [],
  };
}

function getFollowing() {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${baseUrl}/ap/following.json`,
    type: 'OrderedCollection',
    totalItems: 0,
    orderedItems: [],
  };
}

function getInboxPost() {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `${baseUrl}/ap/inbox.json`,
    type: 'OrderedCollection',
    totalItems: 0,
    orderedItems: [],
  };
}

const outDir = './out';

const filesToGenerate = {
  './ap/actor.json': getActor,
  './ap/outbox.json': getOutbox,
  './ap/followers.json': getFollowers,
  './ap/following.json': getFollowing,
  './ap/inbox.json': getInboxPost,
  './ap/nodeinfo.json': getNodeInfoJson,
  './.well-known/webfinger': getWebFinger,
  './.well-known/nodeinfo': getNodeInfo,
};

// Generate main files
for (const [filePath, generator] of Object.entries(filesToGenerate)) {
  const fullPath = path.join(outDir, filePath);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });

  const content = generator();
  // for webfinger, the file has no extension so we handle it separately
  if (filePath.endsWith('webfinger') || filePath.endsWith('nodeinfo')) {
     fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
  } else {
     fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
  }
}

// Generate host-meta as XML
const hostMetaPath = path.join(outDir, './.well-known/host-meta');
fs.mkdirSync(path.dirname(hostMetaPath), { recursive: true });
fs.writeFileSync(hostMetaPath, getHostMeta());


// Generate individual post files
const postsDir = path.join(outDir, 'posts');
fs.mkdirSync(postsDir, { recursive: true });
posts.forEach(post => {
    const postActivity = createCreateActivity(post);
    const postDir = path.join(postsDir, post.slug, 'json');
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.json'), JSON.stringify(postActivity, null, 2));
});

console.log('✅ ActivityPub files generated successfully.');
