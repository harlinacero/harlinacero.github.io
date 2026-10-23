// Minimal static file server for local development and Playwright (Node built-ins only).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, isAbsolute, join, normalize, relative, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ?? '.');
const PORT = Number(process.env.PORT ?? 4173);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

export function resolveRequestPath(root, url) {
  const { pathname } = new URL(url, 'http://localhost');
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
  const filePath = join(root, safePath);
  const rel = relative(root, filePath);
  return rel.startsWith('..') || isAbsolute(rel) ? null : filePath;
}

async function handle(req, res) {
  let filePath;
  try {
    filePath = resolveRequestPath(ROOT, req.url);
  } catch {
    filePath = null;
  }
  if (!filePath) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}

createServer(handle).listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
});
