# ShaanPub (BETA)

<div align="center">
  <img src="https://raw.githubusercontent.com/shaanvision/shaanpub/db5bf0ecea1a2da4129848675bb30ff69e249289/shaanpub-maskot.svg" alt="ShaanPub Mascot" width="200">
</div>

Lightweight Static ActivityPub Server for Read-Only Fediverse Profiles – Shaan Vision

---
_Turkish Documentation available in [README.tr.md](README.tr.md)_
---

## Overview

**ShaanPub** is a TypeScript-based, static ActivityPub server built for publishing read-only Fediverse profiles (i.e., suitable for public portfolios, blogs, and identity broadcasting without authentication or interactive features). ShaanPub enables your content and profile to integrate into Fediverse networks such as Mastodon and Pleroma, using the ActivityPub protocol.

- **Primary Language**: TypeScript
- **Other Languages**: JavaScript, CSS
- **License**: GPL3
- **Status**: BETA
- **Fediverse Example**: [@shaanvision@social.shaanvision.com.tr](https://social.shaanvision.com.tr/@shaanvision)

---

## Features

- **Multi-User Support**: Host multiple Fediverse profiles on a single instance
- Clean URLs with `/@handle` format for user profiles
- Implements ActivityPub-compliant JSON endpoints (WebFinger, actor, outbox, etc.)
- Serves public, read-only profiles and content
- Integrates with static hosting (no database required)
- Simple configuration using JSON files
- Easy deployment by copying configuration and post data
- Designed for uniform compatibility across various Fediverse servers
- Automatic RSA key generation for profile verification
- Modern, responsive UI with professional design
- Shared header and footer components featuring ShaanPub mascot

---

## New Features (Latest Updates)

### Multi-User Support
- Configure multiple users in a single `config.json` file
- Each user gets their own profile page at `/@handle`
- Homepage displays a list of all configured users
- URL rewrites for clean, user-friendly URLs

### Redesigned Interface
- Modern homepage with engaging layout
- Professional user profile pages with dynamic `ProfileHeader`
- Updated `PostCard` component with contemporary design
- Shared `Header` component featuring ShaanPub mascot
- Shared `Footer` component with links to resources
- Support for remote images in user avatars

### Improved Key Management
- Automatic RSA key pair generation via `scripts/generate-keys.mjs`
- Keys generated automatically during `npm install` (postinstall hook)
- Private keys stored in `.keys/` directory (gitignored for security)
- Public keys automatically used for ActivityPub verification

---

## Example Fediverse Integration

- WebFinger:  
  `https://social.shaanvision.com.tr/.well-known/webfinger?resource=acct:shaanvision@social.shaanvision.com.tr`

Returns:
```json
{
  "subject": "acct:shaanvision@social.shaanvision.com.tr",
  "aliases": [
    "https://social.shaanvision.com.tr/@shaanvision"
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "type": "text/html",
      "href": "https://social.shaanvision.com.tr/@shaanvision"
    },
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://social.shaanvision.com.tr/@shaanvision"
    }
  ]
}
```

- Actor Endpoint (`application/activity+json`):
  `https://social.shaanvision.com.tr/users/shaanvision.json`

Returns:
```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    {
      "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
      "toot": "http://joinmastodon.org/ns#",
      "featured": {
        "@id": "toot:featured",
        "@type": "@id"
      },
      "discoverable": "toot:discoverable",
      "schema": "http://schema.org#",
      "PropertyValue": "schema:PropertyValue",
      "value": "schema:value"
    }
  ],
  "id": "https://social.shaanvision.com.tr/users/shaanvision.json",
  "type": "Person",
  "name": "Shaan Vision",
  "preferredUsername": "shaanvision",
  "summary": "ShaanPub - Shaan Vision. Building modern software solutions for enterprise, supporting open source.",
  "inbox": "https://social.shaanvision.com.tr/users/shaanvision/inbox.json",
  "outbox": "https://social.shaanvision.com.tr/users/shaanvision/outbox.json",
  "followers": "https://social.shaanvision.com.tr/users/shaanvision/followers.json",
  "following": "https://social.shaanvision.com.tr/users/shaanvision/following.json",
  "icon": {
    "type": "Image",
    "mediaType": "image/png",
    "url": "https://www.shaanvision.com.tr/logo.png"
  },
  "image": {
    "type": "Image",
    "mediaType": "image/png",
    "url": "https://www.shaanvision.com.tr/logo.png"
  },
  "publicKey": {
    "id": "https://social.shaanvision.com.tr/users/shaanvision.json#main-key",
    "owner": "https://social.shaanvision.com.tr/users/shaanvision.json",
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
  },
  "attachment": [
    {
      "type": "PropertyValue",
      "name": "Website",
      "value": "<a href=\"https://www.shaanvision.com.tr\" rel=\"me nofollow noopener noreferrer\" target=\"_blank\">https://www.shaanvision.com.tr</a>"
    }
  ],
  "manuallyApprovesFollowers": true,
  "discoverable": true,
  "published": "2025-11-14T10:35:40.567Z"
}
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm/yarn

### Installation

```sh
git clone https://github.com/shaanvision/shaanpub.git
cd shaanpub
npm install
```

**Note**: RSA key pairs will be automatically generated during installation.

### Configuration

#### Multi-User Setup

- Copy example configuration files:
  ```sh
  cp config.json.example config.json
  cp posts.json.example posts.json
  ```

- Edit `config.json` with your users array:
  ```json
  {
    "users": [
      {
        "handle": "shaanvision",
        "name": "Shaan Vision",
        "bio": "Your bio here",
        "icon": "https://example.com/avatar.png"
      },
      {
        "handle": "anotheruser",
        "name": "Another User",
        "bio": "Another bio",
        "icon": "https://example.com/avatar2.png"
      }
    ]
  }
  ```

- Edit `posts.json` (assign posts to users by handle):
  ```json
  {
    "posts": [
      {
        "author": "shaanvision",
        "slug": "my-first-post",
        "content": "Hello Fediverse!",
        "published": "2025-01-01T00:00:00Z"
      }
    ]
  }
  ```

#### Key Management

Keys are automatically generated in the `.keys/` directory during installation. The system uses:
- `.keys/private.pem` – Private key (never committed to git)
- `.keys/public.pem` – Public key (used for ActivityPub verification)

To manually regenerate keys:
```sh
npm run generate-keys
```

### Running the Server

#### Development
```sh
npm run dev
```

#### Production Build
```sh
npm run build
npm start
```

#### Static Export
```sh
npm run build
# Static files will be in the `out/` directory
```

### Folder Structure

- `src/` – Core TypeScript/React components and pages
- `src/app/` – Next.js app directory structure
- `src/components/` – Reusable UI components (Header, Footer, ProfileHeader, PostCard)
- `scripts/` – Utility scripts (key generation, ActivityPub generation)
- `config.json` – Multi-user profile configuration
- `posts.json` – Public post data
- `.keys/` – RSA key pairs (gitignored)
- `public/` – Static assets
- `public/_redirects` – Rewrites for static hosting
- Additional configs: Next.js, Tailwind, PostCSS

---

## URL Structure

- `/` – Homepage with list of all users
- `/@handle` – User profile page
- `/@handle/posts/[slug]` – Individual post page
- `/.well-known/webfinger` – WebFinger endpoint
- `/users/[handle].json` – ActivityPub actor endpoint
- `/users/[handle]/outbox.json` – User's outbox
- `/users/[handle]/inbox.json` – User's inbox (read-only)
- `/users/[handle]/followers.json` – User's followers

---

## API Endpoints

All endpoints serve `application/activity+json` or `application/jrd+json` (WebFinger).

- `/.well-known/webfinger?resource=acct:handle@domain`
  - WebFinger resource discovery
- `/@handle` (with Accept: application/activity+json)
  - ActivityPub actor object for user profile
- `/users/{handle}/outbox.json`
  - List of public activities/posts
- `/users/{handle}/inbox.json`
  - Endpoint for ActivityPub inbox (read-only)
- `/users/{handle}/followers.json`
  - List of followers (may be empty or static)

---

## Deployment

### Static Hosting (Netlify, Vercel, Cloudflare Pages)

1. Build the static site:
   ```sh
   npm run build
   ```

2. Deploy the `out/` directory to your hosting provider

3. Ensure `public/_redirects` is properly configured for URL rewrites

### Traditional Hosting

1. Build and start the Next.js server:
   ```sh
   npm run build
   npm start
   ```

---

## Fediverse Profile Discovery and Visibility

### Important Notes

- **Activity Required**: Profiles must publish at least one post/activity to be discovered by Mastodon and other Fediverse clients
- **Caching**: Mastodon caches remote accounts for 12-24 hours. New profiles and updates may take this long to appear
- **First Post**: Ensure each user has at least one post in `posts.json` for immediate visibility

### Visibility Assistance

If your account is not visible on Mastodon or other platforms after publishing:
- Visit [shaanpub.shaanvision.com.tr](https://shaanpub.shaanvision.com.tr) for diagnostics and troubleshooting

---

## Known Issues

- **Dynamic Page Titles**: User profile page titles may not update correctly in Next.js 15 static exports (non-critical UI bug)

---

## Contributing

- Fork, clone, and open pull requests for new features or bug fixes
- The codebase uses Next.js 15, TypeScript, Tailwind CSS, and PostCSS
- Please submit issues if you find unexpected ActivityPub compatibility problems

---

## License
GPL3 License – See [LICENSE](LICENSE) for details.
---

## Links & Credits

- Website: [https://shvn.tr](https://shvn.tr)
- GitHub: [https://github.com/shaanvision](https://github.com/shaanvision)
- GitLab: [https://gitlab.com/shaanvision](https://gitlab.com/shaanvision)
- Profile Icon: ![Logo](https://www.shaanvision.com.tr/logo.png)

---

## Dependencies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- react-icons
- lucide-react

---
