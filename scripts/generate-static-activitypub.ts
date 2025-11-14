// scripts/generate-static-activitypub.ts

import { mkdir, writeFile, readFile } from "fs/promises";
import { dirname, join } from "path";
import config from "../config.json" assert { type: "json" };
import postsData from "../posts.json" assert { type: "json" };

const PUBLIC_DIR = join(process.cwd(), "public");
const BASE_URL = config.url;
const DOMAIN = new URL(BASE_URL).hostname;
const allPosts = postsData.posts;

// JSON file writer
async function writeJsonToFile(path: string, data: any) {
  const filePath = join(PUBLIC_DIR, path);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ ${path}`);
}

// WebFinger JSON
function generateWebFinger(user: any) {
  return {
    subject: `acct:${user.handle}@${DOMAIN}`,
    aliases: [
      `${BASE_URL}/users/${user.handle}`,
      `${BASE_URL}/users/${user.handle}.json`
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

// Actor JSON
async function generateActor(user: any, publicKey: string) {
  return {
    "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
        {
          "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
          "toot": "http://joinmastodon.org/ns#",
          "featured": { "@id": "toot:featured", "@type": "@id" },
          "discoverable": "toot:discoverable",
          "schema": "http://schema.org#",
          "PropertyValue": "schema:PropertyValue",
          "value": "schema:value",
        }
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
    icon: {
      type: "Image",
      mediaType: "image/png",
      url: user.avatar,
    },
    image: {
        type: "Image",
        mediaType: "image/png",
        url: user.avatar,
    },
    publicKey: {
        id: `${BASE_URL}/users/${user.handle}.json#main-key`,
        owner: `${BASE_URL}/users/${user.handle}.json`,
        publicKeyPem: publicKey
    },
    attachment: user.links.map((link: any) => ({
      type: "PropertyValue",
      name: link.label,
      value: `<a href="${link.href}" rel="me nofollow noopener noreferrer" target="_blank">${link.href}</a>`,
    })),
    manuallyApprovesFollowers: true,
    discoverable: true,
    published: new Date().toISOString(),
  };
}

function emptyCollection(id: string) {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id,
    type: "OrderedCollection",
    totalItems: 0,
    orderedItems: [],
  };
}

function generateOutbox(user: any) {
  const userPosts = allPosts.filter(p => p.authorHandle === user.handle);
  const items = userPosts.map((post: any) => ({
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
    orderedItems: items.sort((a,b) => new Date(b.published).getTime() - new Date(a.published).getTime()),
  };
}

async function generatePostJsons(user: any) {
  const userPosts = allPosts.filter(p => p.authorHandle === user.handle);
  for (const post of userPosts) {
    const data = {
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
    };
    await writeJsonToFile(`users/${user.handle}/posts/${post.slug}.json`, data);
  }
}

async function main() {
  console.log("🚀 Generating static ActivityPub files for all users...\n");

  const publicKey = await readFile(join(process.cwd(), "public.pem"), "utf-8");

  for (const user of config.users) {
    console.log(`Generating files for ${user.handle}...`);

    // Generate user-specific files
    await writeJsonToFile(`.well-known/webfinger?resource=acct:${user.handle}@${DOMAIN}`, generateWebFinger(user));
    await writeJsonToFile(`users/${user.handle}.json`, await generateActor(user, publicKey));
    await writeJsonToFile(`users/${user.handle}/inbox.json`, emptyCollection(`${BASE_URL}/users/${user.handle}/inbox.json`));
    await writeJsonToFile(`users/${user.handle}/outbox.json`, generateOutbox(user));
    await writeJsonToFile(`users/${user.handle}/followers.json`, emptyCollection(`${BASE_URL}/users/${user.handle}/followers.json`));
    await writeJsonToFile(`users/${user.handle}/following.json`, emptyCollection(`${BASE_URL}/users/${user.handle}/following.json`));

    await generatePostJsons(user);
    console.log(`✓ Files for ${user.handle} generated successfully!\n`);
  }

  // Generate general discovery files
  await writeFile(
    join(PUBLIC_DIR, ".well-known/host-meta"),
    `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" type="application/jrd+json" template="${BASE_URL}/.well-known/webfinger?resource={uri}" />
</XRD>`,
    "utf-8"
  );
  console.log("✓ .well-known/host-meta");

  console.log("\n✅ All ActivityPub files generated successfully!");
}

main();
