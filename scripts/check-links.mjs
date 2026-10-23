// Quality check (AC-30): every link in the content and in index.html must work.
// Usage: node scripts/check-links.mjs   (exit code 1 when a link is broken)
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OWN_SITE = 'https://harlinacero.github.io/';
const UNVERIFIABLE_STATUSES = new Set([999, 429]); // LinkedIn bot wall, rate limiting
const LOCAL_PATH = /^(assets|content)\/[\w./-]+$/;
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

function collectStrings(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else if (node && typeof node === 'object') Object.values(node).forEach((child) => collectStrings(child, out));
  return out;
}

/** Links found in parsed JSON documents and raw HTML strings. */
export function collectLinks(jsonDocuments, htmlDocuments) {
  const fromJson = jsonDocuments.flatMap((doc) => collectStrings(doc))
    .filter((value) => /^https?:\/\//.test(value) || LOCAL_PATH.test(value));
  const fromHtml = htmlDocuments.flatMap((html) => [...html.matchAll(/\b(?:href|src|content)="([^"]+)"/g)].map((match) => match[1]))
    .filter((value) => /^https?:\/\//.test(value) || LOCAL_PATH.test(value));
  return [...new Set([...fromJson, ...fromHtml])];
}

async function request(url, method, fetchFn) {
  return fetchFn(url, { method, redirect: 'follow', headers: { 'user-agent': 'harlinacero.github.io link checker' } });
}

async function checkRemote(url, { fetchFn, retries, delayMs }) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      let response = await request(url, 'HEAD', fetchFn);
      if (response.status === 405 || response.status === 403) response = await request(url, 'GET', fetchFn);
      if (UNVERIFIABLE_STATUSES.has(response.status)) return { warning: `HTTP ${response.status} (unverifiable)` };
      if (response.ok) return {};
      lastError = `HTTP ${response.status}`;
      if (response.status < 500) break;
    } catch (error) {
      lastError = error.message;
    }
    if (attempt < retries) await sleep(delayMs * (attempt + 1));
  }
  return { error: lastError };
}

export async function checkLinks(urls, { fetchFn = globalThis.fetch, exists = existsSync, retries = 2, delayMs = 1000 } = {}) {
  const broken = [];
  const warnings = [];
  await Promise.all(urls.map(async (url) => {
    const localPath = url.startsWith(OWN_SITE) ? decodeURIComponent(new URL(url).pathname.slice(1)) : (LOCAL_PATH.test(url) ? url : null);
    if (localPath !== null) {
      if (localPath !== '' && !exists(localPath)) broken.push({ url, reason: 'file not found' });
      return;
    }
    const result = await checkRemote(url, { fetchFn, retries, delayMs });
    if (result.error) broken.push({ url, reason: result.error });
    if (result.warning) warnings.push({ url, reason: result.warning });
  }));
  return { broken, warnings };
}

async function main() {
  const root = process.cwd();
  const contentFiles = readdirSync(resolve(root, 'content')).filter((name) => name.endsWith('.json'));
  const json = contentFiles.map((name) => JSON.parse(readFileSync(resolve(root, 'content', name), 'utf-8')));
  const html = [readFileSync(resolve(root, 'index.html'), 'utf-8')];
  const links = collectLinks(json, html);

  const { broken, warnings } = await checkLinks(links, { exists: (path) => existsSync(resolve(root, path)) });
  warnings.forEach(({ url, reason }) => console.warn(`warn  ${url} — ${reason}`));
  broken.forEach(({ url, reason }) => console.error(`FAIL  ${url} — ${reason}`));
  console.log(`${links.length} links checked: ${broken.length} broken, ${warnings.length} unverifiable.`);
  if (broken.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
