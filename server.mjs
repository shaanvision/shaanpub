// server.mjs
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { stat, readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const outDir = join(__dirname, 'out');

// --- Middleware ---

// Middleware to set Content-Type for all ActivityPub related JSON files
app.use((req, res, next) => {
    if (req.path.startsWith('/users/') && req.path.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/activity+json; charset=utf-8');
    }
    next();
});

// --- High Priority Routes ---

// WebFinger Route
// Responds to requests like: /.well-known/webfinger?resource=acct:shaanvision@example.com
app.get('/.well-known/webfinger', async (req, res) => {
    const resource = req.query.resource;

    if (!resource || typeof resource !== 'string' || !resource.startsWith('acct:')) {
        return res.status(400).send('Bad request. Resource parameter must be in acct:user@domain format.');
    }

    const handle = resource.split('@')[0].replace('acct:', '');
    const webfingerFile = join(outDir, '.well-known', `webfinger.${handle}.json`);

    try {
        // Check if the file exists for the requested handle
        await stat(webfingerFile);
        const data = await readFile(webfingerFile, 'utf-8');
        res.setHeader('Content-Type', 'application/jrd+json; charset=utf-8');
        res.send(data);
    } catch (error) {
        // If the file doesn't exist, the user is not found
        res.status(404).send('User not found');
    }
});

// --- URL Rewrites for Next.js Pages ---

// Rewrite for user profile pages: /@handle -> /handle.html
app.get('/@:handle', async (req, res, next) => {
    const { handle } = req.params;
    // Prevent conflicts with other files or routes
    if (handle.includes('.') || handle.startsWith('_next')) {
        return next();
    }
    const filePath = join(outDir, `${handle}.html`);
    try {
        await stat(filePath);
        res.sendFile(filePath);
    } catch (error) {
        // If file doesn't exist, fall through to the 404 handler
        next();
    }
});

// Rewrite for post pages: /@handle/posts/slug -> /handle/posts/slug.html
app.get('/@:handle/posts/:slug', async (req, res, next) => {
    const { handle, slug } = req.params;
    const filePath = join(outDir, handle, 'posts', `${slug}.html`);
    try {
        await stat(filePath);
        res.sendFile(filePath);
    } catch (error) {
        next();
    }
});


// --- Static File Serving ---

// Serve all static files from the 'out' directory (e.g., _next, images, etc.)
// This comes after custom routes to ensure they are not overridden.
app.use(express.static(outDir, {
    dotfiles: 'allow' // Important for serving /.well-known/
}));


// --- Fallback 404 Handler ---

// For any request that hasn't been handled yet, serve the custom 404 page.
app.use((req, res) => {
    res.status(404).sendFile(join(outDir, '404.html'));
});


// --- Start Server ---

app.listen(port, () => {
    console.log(`🚀 ShaanPub server listening on http://localhost:${port}`);
});
