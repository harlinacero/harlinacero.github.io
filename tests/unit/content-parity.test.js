import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { findMissingKeys } from '../../assets/js/i18n.js';
import { FALLBACK_MESSAGES } from '../../assets/js/fallback-messages.js';

const readJson = (file) => JSON.parse(readFileSync(resolve(process.cwd(), file), 'utf-8'));

function emptyTexts(node, prefix = '') {
  if (typeof node === 'string') return node.trim() === '' ? [prefix] : [];
  if (node === null || typeof node !== 'object') return [];
  return Object.entries(node).flatMap(([key, child]) => emptyTexts(child, prefix ? `${prefix}.${key}` : key));
}

describe('content parity', () => {
  const en = readJson('content/en.json');
  const es = readJson('content/es.json');

  it('should have identical keys when comparing en.json and es.json', () => {
    // Arrange / Act
    const missing = findMissingKeys(en, es);

    // Assert
    expect(missing, `texts missing in one language: ${missing.join(', ')}`).toEqual([]);
  });

  it('should have no empty texts in either language', () => {
    // Arrange / Act
    const empty = [...emptyTexts(en).map((p) => `en:${p}`), ...emptyTexts(es).map((p) => `es:${p}`)];

    // Assert
    expect(empty, `empty texts: ${empty.join(', ')}`).toEqual([]);
  });

  it('should have both languages in fallback-messages', () => {
    // Arrange / Act
    const missing = findMissingKeys(FALLBACK_MESSAGES.en, FALLBACK_MESSAGES.es);

    // Assert
    expect(Object.keys(FALLBACK_MESSAGES).sort()).toEqual(['en', 'es']);
    expect(missing).toEqual([]);
    expect(emptyTexts(FALLBACK_MESSAGES)).toEqual([]);
  });
});
