# ShaanPub (BETA)

Lightweight Static ActivityPub Server for Read-Only Fediverse Profiles – Shaan Vision

---
_Turkish Documentation available in [README.tr.md](README.tr.md)_
---

## Overview

**ShaanPub** is a TypeScript-based, static ActivityPub server built for publishing a read-only Fediverse profile (i.e., suitable for public portfolios, blogs, and identity broadcasting without authentication or interactive features). ShaanPub enables your content and profile to integrate into Fediverse networks such as Mastodon and Pleroma, using the ActivityPub protocol.

- **Primary Language**: TypeScript
- **Other Languages**: JavaScript, CSS
- **License**: MIT
- **Status**: BETA
- **Fediverse Example**: [@shaanvision@social.shaanvision.com.tr](https://social.shaanvision.com.tr/@shaanvision)

---

## Features

- Implements ActivityPub-compliant JSON endpoints (WebFinger, actor, outbox, etc.)
- Serves public, read-only profiles and content
- Integrates with static hosting (no database required)
- Simple configuration using JSON files
- Easy deployment by copying configuration and post data
- Designed for uniform compatibility across various Fediverse servers
- Public key publishing for profile verification

---

## Example Fediverse Integration

- WebFinger:  
  `https://social.shaanvision.com.tr/.well-known/webfinger?resource=acct:shaanvision@social.shaanvision.com.tr`

Returns:
```json
{
  "subject": "acct:shaanvision@social.shaanvision.com.tr",
  "aliases": [
    "https://social.shaanvision.com.tr/users/shaanvision.json",
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
      "href": "https://social.shaanvision.com.tr/users/shaanvision.json"
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
    ...
  ],
  "id": "https://social.shaanvision.com.tr/users/shaanvision.json",
  "type": "Person",
  "preferredUsername": "shaanvision",
  "name": "Shaan Vision",
  "summary": "ShaanPub - Shaan Vision. Building modern software solutions for enterprise, supporting open source. Let's talk tech, code, and the future.",
  "inbox": "https://social.shaanvision.com.tr/users/shaanvision/inbox.json",
  "outbox": "https://social.shaanvision.com.tr/users/shaanvision/outbox.json",
  ... // see full example in documentation
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

### Configuration

- Copy example configuration files:
  ```sh
  cp config.json.example config.json
  cp posts.json.example posts.json
  ```
- Edit `config.json` (profile details) and `posts.json` (public posts).
- Place your public key in `public.pem`.

#### Generating Keypair Example

```sh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

### Running the Server

```sh
node server.mjs
```
Or use build tooling/scripts for static export.

### Folder Structure

- `src/` – Core TypeScript logic
- `server.mjs` – HTTP server, REST endpoints
- `config.json` – Profile configuration
- `posts.json` – Public post data
- `public/` – Static assets
- `public.pem` – Public key
- Additional configs: Next.js, Tailwind, PostCSS

---

## API Endpoints

- `/.well-known/webfinger`
  - Responds with WebFinger resource pointer
- `/users/{username}.json`
  - ActivityPub actor object for your profile
- `/users/{username}/outbox.json`
  - List of public activities/posts
- `/users/{username}/inbox.json`
  - Endpoint for ActivityPub inbox (read-only)
- `/users/{username}/followers.json`
  - List of followers (may be empty or static)

All endpoints serve `application/activity+json` or `application/jrd+json` (WebFinger).

---

## Example Configuration Files

See [`config.json.example`](config.json.example) and [`posts.json.example`](posts.json.example) for ready-to-use templates.

---

## Fediverse Profile Discovery and Visibility Caveats

If you want your ActivityPub profile to appear on Mastodon or similar interfaces:

- **Activity Required:** The profile (actor) must publish at least one post or activity. Mastodon and most other Fediverse clients only discover and display remote accounts after their first public post or activity appears in the account's outbox.

- **Caching:** Mastodon (and similar platforms) cache remote account and post data for **12 or 24 hours**. Your profile will become visible only after the cache refreshes following your first post/activity. Profile changes and new posts may also take 12–24 hours to appear to users on these platforms.

- **Tip:** For immediate visibility, make sure your profile actor publishes at least one activity, and prepare for a short delay (12–24 hours) before your profile is publicly visible and updates are synchronized.

- **Visibility Assistance:**  
  If your account is not visible on Mastodon or other compatible platforms after you have published your first post, you can visit [shaanpub.shaanvision.com.tr](https://shaanpub.shaanvision.com.tr). This site will provide information and diagnostics to help you resolve profile visibility issues.

---

## Contributing

- Fork, clone, and open pull requests for new features or bug fixes.
- The codebase uses conventional TypeScript tooling and styling (Tailwind/PostCSS).
- Please submit issues if you find unexpected ActivityPub compatibility problems.

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
