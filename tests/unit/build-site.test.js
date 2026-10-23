import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, mkdtempSync, rmSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { buildSite } from '../../scripts/build-site.mjs';

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

describe('buildSite', () => {
  let outDir;

  beforeAll(() => {
    outDir = join(mkdtempSync(join(tmpdir(), 'site-')), '_site');
    buildSite({ root: process.cwd(), outDir });
  });

  afterAll(() => rmSync(join(outDir, '..'), { recursive: true, force: true }));

  it('should copy only publishable files when building the site', () => {
    // Arrange / Act
    const files = listFiles(outDir).map((file) => relative(outDir, file).replaceAll('\\', '/'));
    const topLevel = [...new Set(files.map((file) => file.split('/')[0]))].sort();

    // Assert
    expect(topLevel).toEqual(['.nojekyll', 'assets', 'content', 'index.html']);
    expect(files).toContain('assets/cv/harlin-acero-cv-en.pdf');
    expect(files).toContain('content/es.json');
    ['features', 'tests', 'CLAUDE.md', 'node_modules', 'package.json', 'scripts'].forEach((excluded) => {
      expect(existsSync(join(outDir, excluded))).toBe(false);
    });
  });
});
