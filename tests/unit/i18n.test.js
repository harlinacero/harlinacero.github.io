import { describe, it, expect, vi } from 'vitest';
import { resolveLanguage, createTranslator, otherLanguage, findMissingKeys } from '../../assets/js/i18n.js';

describe('resolveLanguage', () => {
  it('should resolve spanish when browser prefers es-CO and nothing is stored', () => {
    // Arrange
    const input = { urlLang: null, storedLang: null, browserLangs: ['es-CO', 'en'] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('es');
  });

  it('should resolve english when browser prefers fr-FR and nothing is stored', () => {
    // Arrange
    const input = { urlLang: null, storedLang: null, browserLangs: ['fr-FR', 'es'] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('en');
  });

  it('should resolve english when the browser reports no languages', () => {
    // Arrange
    const input = { urlLang: null, storedLang: null, browserLangs: [] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('en');
  });

  it('should resolve the stored language when browser prefers another one', () => {
    // Arrange
    const input = { urlLang: null, storedLang: 'es', browserLangs: ['en-US'] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('es');
  });

  it('should resolve the url language when a different language is stored', () => {
    // Arrange
    const input = { urlLang: 'en', storedLang: 'es', browserLangs: ['es-CO'] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('en');
  });

  it('should ignore an unsupported url language when resolving', () => {
    // Arrange
    const input = { urlLang: 'fr', storedLang: null, browserLangs: ['es'] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('es');
  });

  it('should ignore an unsupported stored language when resolving', () => {
    // Arrange
    const input = { urlLang: null, storedLang: 'de', browserLangs: ['en-GB'] };

    // Act
    const lang = resolveLanguage(input);

    // Assert
    expect(lang).toBe('en');
  });
});

describe('createTranslator', () => {
  const en = { ui: { hello: 'Hello', only: 'Only in English' }, list: ['one', 'two'] };
  const es = { ui: { hello: 'Hola' }, list: ['uno', 'dos'] };

  it('should return the text of the current language when the key exists', () => {
    // Arrange
    const t = createTranslator(es, en);

    // Act
    const text = t('ui.hello');

    // Assert
    expect(text).toBe('Hola');
  });

  it('should return the fallback text when a key is missing in the current language', () => {
    // Arrange
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const t = createTranslator(es, en);

    // Act
    const text = t('ui.only');

    // Assert
    expect(text).toBe('Only in English');
    expect(warn).toHaveBeenCalledWith('[i18n] missing key', 'ui.only');
    warn.mockRestore();
  });

  it('should return an empty string and never the path when a key is missing everywhere', () => {
    // Arrange
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const t = createTranslator(es, en);

    // Act
    const text = t('ui.nowhere');

    // Assert
    expect(text).toBe('');
    warn.mockRestore();
  });

  it('should return arrays and nested objects when the path points to them', () => {
    // Arrange
    const t = createTranslator(es, en);

    // Act
    const list = t('list');

    // Assert
    expect(list).toEqual(['uno', 'dos']);
  });
});

describe('otherLanguage', () => {
  it('should offer the other language when asked for the toggle target', () => {
    // Arrange / Act / Assert
    expect(otherLanguage('en')).toBe('es');
    expect(otherLanguage('es')).toBe('en');
  });
});

describe('findMissingKeys', () => {
  it('should list the dotted path when a key exists in only one dictionary', () => {
    // Arrange
    const a = { a: { b: 1 } };
    const b = { a: {} };

    // Act
    const missing = findMissingKeys(a, b);

    // Assert
    expect(missing).toEqual(['a.b']);
  });

  it('should list paths missing on either side when both dictionaries differ', () => {
    // Arrange
    const a = { ui: { x: 'x' }, list: ['1', '2'] };
    const b = { ui: { y: 'y' }, list: ['1'] };

    // Act
    const missing = findMissingKeys(a, b);

    // Assert
    expect(missing.sort()).toEqual(['list.1', 'ui.x', 'ui.y']);
  });

  it('should return an empty list when both dictionaries have the same keys', () => {
    // Arrange
    const a = { ui: { x: 'x', list: ['a'] } };
    const b = { ui: { x: 'equis', list: ['b'] } };

    // Act
    const missing = findMissingKeys(a, b);

    // Assert
    expect(missing).toEqual([]);
  });
});
