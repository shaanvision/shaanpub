// scripts/generate-static-activitypub.ts

import { mkdir, writeFile, readFile } from "fs/promises";
import { dirname, join } from "path";
import config from "../config.json" assert { type: "json" };
import postsData from "../posts.json" assert { type: "json" };

const OUT_DIR = join(process.cwd(), "out");
const BASE_URL = config.url;
const HANDLE = config.author.handle;
const DOMAIN = new URL(BASE_URL).hostname;
const posts = postsData.posts;

// JSON file writer
async function writeJsonToFile(path: string, data: any) {
  const filePath = join(OUT_DIR, path);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ ${path}`);
}

// XML file writer
async function writeXmlToFile(path: string, content: string) {
  const filePath = join(OUT_DIR, path);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf-8");
  console.log(`✓ ${path}`);
}

// HTML file writer
async function writeHtmlToFile(path: string, content: string) {
  const filePath = join(OUT_DIR, path);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf-8");
  console.log(`✓ ${path}`);
}

// Redirect Page HTML
function generateRedirectPage() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ShaanPub</title>
    <meta http-equiv="refresh" content="5;url=${BASE_URL}">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: sans-serif;
            background-color: #f0f0f0;
            color: #333;
            text-align: center;
            flex-direction: column;
        }
        .container {
            padding: 2rem;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        img {
            width: 100px;
            height: 100px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://os.shaanvision.com.tr/orb.svg" alt="Shaan Vision Orb">
        <h1>Welcome to ShaanPub</h1>
        <p>ShaanPub is developed by ShaanVision</p>
        <p>Profile: <b>${HANDLE}</b></p>
        <p id="countdown">Redirecting you to the homepage in 5 seconds...</p>
    </div>
    <script>
        let countdownElement = document.getElementById('countdown');
        let seconds = 5;
        const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                countdownElement.textContent = \`Redirecting you to the homepage in \${seconds} seconds...\`;
            } else {
                countdownElement.textContent = 'Redirecting...';
                clearInterval(interval);
            }
        }, 1000);
    </script>
</body>
</html>
  `;
  return htmlContent;
}

// WebFinger JSON
function generateWebFinger() {
  return {
    subject: `acct:${HANDLE}@${DOMAIN}`,
    aliases: [`${BASE_URL}/ap/actor`, `${BASE_URL}/`],
    links: [
      {
        rel: "http://webfinger.net/rel/profile-page",
        type: "text/html",
        href: BASE_URL,
      },
      {
        rel: "self",
        type: "application/activity+json",
        href: `${BASE_URL}/ap/actor`,
      },
    ],
  };
}

// Actor JSON
async function generateActor(publicKey: string) {
  return {
    "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
        {
          "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
          "toot": "http://joinmastodon.org/ns#",
          "featured": { "@id": "toot:featured", "@type": "@id" },
          "featuredTags": { "@id": "toot:featuredTags", "@type": "@id" },
          "alsoKnownAs": { "@id": "as:alsoKnownAs", "@type": "@id" },
          "movedTo": { "@id": "as:movedTo", "@type": "@id" },
          "schema": "http://schema.org#",
          "PropertyValue": "schema:PropertyValue",
          "value": "schema:value",
          "discoverable": "toot:discoverable",
          "suspended": "toot:suspended",
          "memorial": "toot:memorial",
          "indexable": "toot:indexable",
          "attributionDomains": { "@id": "toot:attributionDomains", "@type": "@id" }
        }
      ],
    id: `${BASE_URL}/ap/actor`,
    type: "Application",
    preferredUsername: HANDLE,
    inbox: `${BASE_URL}/ap/inbox`,
    outbox: `${BASE_URL}/ap/outbox`,
    followers: `${BASE_URL}/ap/followers`,
    following: `${BASE_URL}/ap/following`,
    featured: `${BASE_URL}/ap/collections/featured`,
    featuredTags: `${BASE_URL}/ap/collections/tags`,
    publicKey: {
        id: `${BASE_URL}/ap/actor#main-key`,
        owner: `${BASE_URL}/ap/actor`,
        publicKeyPem: publicKey
    },
    endpoints: { sharedInbox: `${BASE_URL}/ap/inbox` },
    url: `${BASE_URL}/about`,
    manuallyApprovesFollowers: true,
    discoverable: true,
    indexable: true
  };
}

// Koleksiyon oluşturucu
function emptyCollection(id: string) {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id,
    type: "OrderedCollection",
    totalItems: 0,
    orderedItems: [],
  };
}

// Outbox JSON
function generateOutbox() {
  const items = posts.map((post: any) => ({
    id: `${BASE_URL}/ap/posts/${post.slug}#activity`,
    type: "Create",
    actor: `${BASE_URL}/ap/actor`,
    published: post.published,
    to: ["https://www.w3.org/ns/activitystreams#Public"],
    cc: [`${BASE_URL}/ap/followers`],
    object: `${BASE_URL}/ap/posts/${post.slug}`,
  }));
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${BASE_URL}/ap/outbox`,
    type: "OrderedCollection",
    totalItems: posts.length,
    orderedItems: items,
  };
}

// Nodeinfo JSON
function generateNodeInfo() {
  return {
    version: "2.0",
    software: { name: "ShaanPub", version: "1.0.0" },
    protocols: ["activitypub"],
    usage: { users: { total: 1 }, localPosts: posts.length },
    openRegistrations: false,
    metadata: {},
  };
}

// host-meta XML
function generateHostMeta() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" type="application/jrd+json"
        template="${BASE_URL}/.well-known/webfinger?resource={uri}" />
</XRD>`;
}

// Her post için JSON
async function generatePostJsons() {
  for (const post of posts) {
    const data = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${BASE_URL}/ap/posts/${post.slug}`,
      type: "Note",
      published: post.published,
      attributedTo: `${BASE_URL}/ap/actor`,
      content: post.content,
      url: `${BASE_URL}/posts/${post.slug}`,
      to: ["https://www.w3.org/ns/activitystreams#Public"],
      cc: [`${BASE_URL}/ap/followers`],
      sensitive: post.sensitive || false,
      likes: {
        id: `${BASE_URL}/ap/posts/${post.slug}/likes`,
        type: "OrderedCollection",
        totalItems: 0,
      },
      shares: {
        id: `${BASE_URL}/ap/posts/${post.slug}/shares`,
        type: "OrderedCollection",
        totalItems: 0,
      },
    };
    await writeJsonToFile(`ap/posts/${post.slug}.json`, data);
  }
}

// Ana çalışma
async function main() {
  console.log("🚀 Generating static ActivityPub endpoints...\n");

  const publicKey = await readFile(join(process.cwd(), "public.pem"), "utf-8");

  await writeJsonToFile(".well-known/webfinger", generateWebFinger());
  await writeXmlToFile(".well-known/host-meta.xml", generateHostMeta());
  await writeJsonToFile(".well-known/nodeinfo.json", {
    links: [
      {
        rel: "http://nodeinfo.diaspora.software/ns/schema/2.0",
        href: `${BASE_URL}/ap/nodeinfo`,
      },
    ],
  });

  await writeJsonToFile("ap/actor.json", await generateActor(publicKey));
  await writeJsonToFile("ap/inbox.json", emptyCollection(`${BASE_URL}/ap/inbox`));
  await writeJsonToFile("ap/outbox.json", generateOutbox());
  await writeJsonToFile("ap/followers.json", emptyCollection(`${BASE_URL}/ap/followers`));
  await writeJsonToFile("ap/following.json", emptyCollection(`${BASE_URL}/ap/following`));
  await writeJsonToFile("ap/nodeinfo.json", generateNodeInfo());
  await writeJsonToFile("ap/collections/featured.json", emptyCollection(`${BASE_URL}/ap/collections/featured`));
  await writeJsonToFile("ap/collections/tags.json", emptyCollection(`${BASE_URL}/ap/collections/tags`));

  await generatePostJsons();

  // Generate redirect page
  await writeHtmlToFile(`@${HANDLE}/index.html`, generateRedirectPage());

  console.log("\n✅ All ActivityPub files generated successfully!");
}

main();
