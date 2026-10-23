// Language resolution and translation lookup. Pure functions: no DOM, no storage access.

export const SUPPORTED_LANGUAGES = ['en', 'es'];
export const DEFAULT_LANGUAGE = 'en';

const isSupported = (lang) => SUPPORTED_LANGUAGES.includes(lang);

const primarySubtag = (tag) => String(tag ?? '').toLowerCase().split('-')[0];

/**
 * Picks the language to show.
 * Priority: explicit language in the link › remembered choice › Spanish browser › English.
 */
export function resolveLanguage({ urlLang, storedLang, browserLangs = [] }) {
  if (isSupported(urlLang)) return urlLang;
  if (isSupported(storedLang)) return storedLang;
  const firstBrowserLang = primarySubtag(browserLangs[0]);
  return firstBrowserLang === 'es' ? 'es' : DEFAULT_LANGUAGE;
}

export function otherLanguage(lang) {
  return lang === 'es' ? 'en' : 'es';
}

function lookup(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

const isPresent = (value) => value !== undefined && value !== null && value !== '';

/**
 * Returns t(path): the text in the current language, else in the fallback language,
 * else an empty string. It never returns the path itself.
 */
export function createTranslator(dict, fallbackDict) {
  return function t(path) {
    const value = lookup(dict, path);
    if (isPresent(value)) return value;

    console.warn('[i18n] missing key', path);
    const fallback = lookup(fallbackDict, path);
    return isPresent(fallback) ? fallback : '';
  };
}

function leafPaths(node, prefix = '') {
  if (node === null || typeof node !== 'object') return [prefix];
  return Object.entries(node).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

/** Dotted paths of the texts that exist in one dictionary but not in the other. */
export function findMissingKeys(a, b) {
  const pathsA = new Set(leafPaths(a));
  const pathsB = new Set(leafPaths(b));
  return [
    ...[...pathsA].filter((path) => !pathsB.has(path)),
    ...[...pathsB].filter((path) => !pathsA.has(path)),
  ];
}
