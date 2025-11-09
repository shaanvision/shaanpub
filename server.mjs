import express from 'express';
import { join } from 'path';
import { readFile } from 'fs/promises';

const app = express();
const port = process.env.PORT || 3000;
const outDir = join(process.cwd(), 'out');

// Special handler for WebFinger which has a different Content-Type
app.get('/.well-known/webfinger', async (req, res, next) => {
  try {
    const webfingerPath = join(outDir, '.well-known', 'webfinger');
    const webfingerContent = await readFile(webfingerPath, 'utf-8');
    res.setHeader('Content-Type', 'application/jrd+json; charset=utf-8');
    res.send(webfingerContent);
  } catch (error) {
    next();
  }
});

// Set correct Content-Type for ActivityPub routes before serving them
app.use((req, res, next) => {
  if (
    req.path.startsWith('/ap/') ||
    req.path.startsWith('/posts/') ||
    req.path === '/.well-known/nodeinfo'
  ) {
    res.setHeader('Content-Type', 'application/activity+json; charset=utf-8');
  }
  next();
});

// Serve all static files from the 'out' directory
app.use(express.static(outDir, {
  dotfiles: 'allow' // This is the key change
}));

// Fallback for custom 404 page
app.use((req, res) => {
  res.status(404).sendFile(join(outDir, '404.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
