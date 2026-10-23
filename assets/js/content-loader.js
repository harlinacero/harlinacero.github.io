// Loads the content files. Any failure becomes a ContentLoadError so the page can show
// the fallback message instead of a blank or half-rendered page.
import { otherLanguage } from './i18n.js';

export class ContentLoadError extends Error {
  constructor(file, cause) {
    super(`Could not load ${file}`, { cause });
    this.name = 'ContentLoadError';
    this.file = file;
  }
}

const CONTENT_DIR = 'content';

async function fetchJson(file, fetchFn) {
  let response;
  try {
    response = await fetchFn(file);
  } catch (error) {
    throw new ContentLoadError(file, error);
  }
  if (!response.ok) throw new ContentLoadError(file, new Error(`HTTP ${response.status}`));
  try {
    return await response.json();
  } catch (error) {
    throw new ContentLoadError(file, error);
  }
}

function cachedFetchJson(file, fetchFn, cache) {
  if (!cache) return fetchJson(file, fetchFn);
  if (!cache.has(file)) {
    const request = fetchJson(file, fetchFn);
    request.catch(() => cache.delete(file));
    cache.set(file, request);
  }
  return cache.get(file);
}

/**
 * @param {'en'|'es'} lang language to show; the other one is loaded as fallback.
 * @param {Map} [cache] optional cache shared between calls (language switching).
 */
export async function loadContent(lang, fetchFn = globalThis.fetch, cache = undefined) {
  const load = (name) => cachedFetchJson(`${CONTENT_DIR}/${name}.json`, fetchFn, cache);
  const [dict, fallbackDict, profile, projects, caseStudies] = await Promise.all([
    load(lang),
    load(otherLanguage(lang)),
    load('profile'),
    load('projects'),
    load('case-studies'),
  ]);
  return { dict, fallbackDict, profile, projects, caseStudies };
}
