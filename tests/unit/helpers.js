// Shared fixtures for renderer tests: the real content files, as the site loads them.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createTranslator, otherLanguage } from '../../assets/js/i18n.js';

export const readJson = (file) => JSON.parse(readFileSync(resolve(process.cwd(), file), 'utf-8'));

export function contextFor(lang) {
  const dict = readJson(`content/${lang}.json`);
  const fallbackDict = readJson(`content/${otherLanguage(lang)}.json`);
  return {
    lang,
    t: createTranslator(dict, fallbackDict),
    profile: readJson('content/profile.json'),
    projects: readJson('content/projects.json'),
    caseStudies: readJson('content/case-studies.json'),
  };
}

export const texts = (root, selector) => [...root.querySelectorAll(selector)].map((el) => el.textContent.trim());
