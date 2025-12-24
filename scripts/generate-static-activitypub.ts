// scripts/generate-static-activitypub.ts

import { mkdir, writeFile, readFile, copyFile, cp, stat, access } from "fs/promises";
import { dirname, join } from "path";
import { config, posts } from "../src/lib/config";
import type { User, Post } from "../src/lib/config";
import {
  generateWebFinger,
  generateActor,
  generateOutbox,
  generatePostJson,
  emptyCollection,
  generateFeaturedCollection
} from "../src/lib/activitypub";

const OUTPUT_DIR = join(process.cwd(), "out");
const BASE_URL = config.url;

// Helper to write JSON files
async function writeJsonToFile(path: string, data: any) {
  const filePath = join(OUTPUT_DIR, path);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\\n', "utf-8");
  console.log(`✓ ${path}`);
}

// Helper to write other static files
async function writeStringToFile(path: string, data: string) {
  const filePath = join(OUTPUT_DIR, path);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, data, "utf-8");
  console.log(`✓ ${path}`);
}

// Main generation function
async function main() {
  console.log("🚀 Generating static ActivityPub files...\n");

  const publicKey = await readFile(join(process.cwd(), "public.pem"), "utf-8");

  for (const user of config.users as (User & { header?: string; featured?: string[] })[]) {
    console.log(`Generating files for ${user.handle}...`);

    // Generate user-specific files
    await writeJsonToFile(`.well-known/webfinger.${user.handle}.json`, generateWebFinger(user));
    await writeJsonToFile(`users/${user.handle}.json`, await generateActor(user, publicKey));
    await writeJsonToFile(`users/${user.handle}/inbox.json`, emptyCollection(`${BASE_URL}/users/${user.handle}/inbox.json`));
    await writeJsonToFile(`users/${user.handle}/outbox.json`, generateOutbox(user));
    await writeJsonToFile(`users/${user.handle}/followers.json`, emptyCollection(`${BASE_URL}/users/${user.handle}/followers.json`));
    await writeJsonToFile(`users/${user.handle}/following.json`, emptyCollection(`${BASE_URL}/users/${user.handle}/following.json`));
    await writeJsonToFile(`users/${user.handle}/featured.json`, generateFeaturedCollection(user));

    // Generate individual post files
    const userPosts = posts.posts.filter(p => p.authorHandle === user.handle);
    for (const post of userPosts) {
      const postJson = await generatePostJson(user, post);
      await writeJsonToFile(`users/${user.handle}/posts/${post.slug}.json`, postJson);
    }

    console.log(`✓ Files for ${user.handle} generated successfully!\n`);

    // --- Mastodon Compatibility: Create @handle aliases ---
    // This allows /@handle URLs to work on static hosts and improves compatibility
    const htmlSource = join(OUTPUT_DIR, `${user.handle}.html`);
    const htmlDest = join(OUTPUT_DIR, `@${user.handle}.html`);
    const dirSource = join(OUTPUT_DIR, user.handle);
    const dirDest = join(OUTPUT_DIR, `@${user.handle}`);

    try {
      // 1. Copy profile page: out/handle.html -> out/@handle.html
      // We use access to check if file exists (better than stat for simple existence check in try/catch flow if needed, but here we try/catch the operation)
      try {
        await access(htmlSource);
        await copyFile(htmlSource, htmlDest);
        console.log(`✓ Created alias: @${user.handle}.html`);
      } catch (e) {
        // If handle.html doesn't exist, maybe it's handle/index.html. 
        // But based on Next.js export usually it's clean URLs -> HTML files.
        // Ignoring if source doesn't exist.
      }

      // 2. Copy posts directory: out/handle/ -> out/@handle/
      try {
        await access(dirSource);
        await cp(dirSource, dirDest, { recursive: true });
        console.log(`✓ Created directory alias: @${user.handle}/`);
      } catch (e) {
        // Directory might not exist if user has no posts or folder structure is different
      }

    } catch (error) {
      console.error(`Error creating aliases for ${user.handle}:`, error);
    }
  }

  // Generate general discovery files
  await writeStringToFile(".well-known/host-meta", `<?xml version="1.0" encoding="UTF-8"?><XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0"><Link rel="lrdd" type="application/jrd+json" template="${BASE_URL}/.well-known/webfinger?resource={uri}" /></XRD>`);

  // --- Deployment Config Generation ---
  console.log("\n⚙️ Generating deployment configurations...");

  // 1. Netlify / Cloudflare Pages Headers (_headers)
  const headersContent = `# CORS Headers
/*
  Access-Control-Allow-Origin: *

# ActivityPub JSON Content-Types
/users/*.json
  Content-Type: application/activity+json; charset=utf-8

/.well-known/webfinger*
  Content-Type: application/jrd+json; charset=utf-8
`;
  await writeStringToFile("_headers", headersContent);

  // 2. Netlify / Cloudflare Pages Redirects (_redirects)
  let redirectsContent = `# Static redirects for Next.js pages
/@:handle /:handle.html 200
/@:handle/posts/:slug /:handle/posts/:slug.html 200

# WebFinger redirects
`;

  // 3. Vercel Config (vercel.json)
  const vercelConfig = {
    headers: [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }
        ]
      },
      {
        source: "/users/(.*).json",
        headers: [
          { key: "Content-Type", value: "application/activity+json; charset=utf-8" }
        ]
      },
      {
        source: "/.well-known/webfinger(.*)",
        headers: [
          { key: "Content-Type", value: "application/jrd+json; charset=utf-8" }
        ]
      }
    ],
    rewrites: [
      {
        source: "/@:handle",
        destination: "/:handle.html"
      },
      {
        source: "/@:handle/posts/:slug",
        destination: "/:handle/posts/:slug.html"
      }
    ] as any[]
  };

  for (const user of config.users) {
    // Netlify Redirect
    // Note: We use the full domain in the resource param to be safe and spec compliant
    const domain = BASE_URL.replace('https://', '').replace('http://', '');
    redirectsContent += `/.well-known/webfinger resource=acct:${user.handle}@${domain} /.well-known/webfinger.${user.handle}.json 200\n`;

    // Vercel Rewrite
    vercelConfig.rewrites.unshift({
      source: "/.well-known/webfinger",
      has: [
        {
          type: "query",
          key: "resource",
          value: `acct:${user.handle}@${domain}`
        }
      ],
      destination: `/.well-known/webfinger.${user.handle}.json`
    });
  }

  await writeStringToFile("_redirects", redirectsContent);

  // Write vercel.json to ROOT (for Vercel to pick up) and OUT (for reference)
  await writeFile(join(process.cwd(), "vercel.json"), JSON.stringify(vercelConfig, null, 2), "utf-8");
  console.log(`✓ vercel.json (Updated at project root)`);


  // 4. Create files with literal query params in filenames (User Request)
  // Attempting to match requests like /webfinger?resource=... by having a file literally named that.
  for (const user of config.users) {
    // Clean domain from BASE_URL
    const domain = BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const literalFilename = `.well-known/webfinger?resource=acct:${user.handle}@${domain}`;

    // We use writeJsonToFile which helps with creating dirs if needed (though .well-known exists)
    await writeJsonToFile(literalFilename, generateWebFinger(user));
  }

  // 5. Cloudflare Pages Worker (_worker.js)
  // Required because Cloudflare Pages _redirects does not support query parameter matching.
  // This worker intercepts the request, checks for ?resource=acct:..., and fetches the correct static JSON.
  const workerContent = `
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle WebFinger
    if (url.pathname === '/.well-known/webfinger') {
      const resource = url.searchParams.get('resource');
      if (resource && resource.startsWith('acct:')) {
        // Extract handle from acct:handle@domain
        // We try to match what our build script generated: .well-known/webfinger.HANDLE.json
        // Note: The script implies we trust the handle to be one of ours if we want to redirect, 
        // or we just try to fetch the corresponding file and let it 404 if not found.
        
        // Simple extraction:
        const match = resource.match(/acct:([^@]+)/);
        if (match && match[1]) {
          const handle = match[1];
          const targetPath = \`/.well-known/webfinger.\${handle}.json\`;
          
          // Re-route to the static file
          const newUrl = new URL(request.url);
          newUrl.pathname = targetPath;
          newUrl.search = ''; // Clear params to avoid loop if rules were different, mainly just cleaner
          
          return env.ASSETS.fetch(newUrl);
        }
      }
    }

    // Default: Serve static assets
    return env.ASSETS.fetch(request);
  }
};`;

  await writeStringToFile("_worker.js", workerContent.trim());


  console.log("\n✅ All ActivityPub and Deployment files generated successfully!");
}

main();
