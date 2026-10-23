// Assembles the publishable site into _site/: only what visitors need (no specs, tests,
// tooling or CLAUDE.md). Usage: node scripts/build-site.mjs
import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PUBLISHABLE = ['index.html', '.nojekyll', 'assets', 'content'];

export function buildSite({ root = process.cwd(), outDir = resolve(root, '_site') } = {}) {
  rmSync(outDir, { recursive: true, force: true });
  PUBLISHABLE.forEach((entry) => {
    const source = resolve(root, entry);
    if (!existsSync(source)) throw new Error(`Missing publishable entry: ${entry}`);
    cpSync(source, resolve(outDir, entry), { recursive: true });
  });
  return outDir;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  console.log(`Site built at ${buildSite()}`);
}
