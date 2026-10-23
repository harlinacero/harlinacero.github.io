import { describe, it, expect, vi } from 'vitest';
import { loadContent, ContentLoadError } from '../../assets/js/content-loader.js';

const FILES = {
  'content/en.json': { ui: { hello: 'Hello' } },
  'content/es.json': { ui: { hello: 'Hola' } },
  'content/profile.json': { name: 'Harlin Acero' },
  'content/projects.json': [{ id: 'microservicesDemo' }],
  'content/case-studies.json': [{ id: 'microservicesDemo' }],
};

const okResponse = (body) => ({ ok: true, status: 200, json: async () => body });

function fakeFetch(overrides = {}) {
  return vi.fn(async (url) => {
    if (url in overrides) return overrides[url]();
    if (url in FILES) return okResponse(FILES[url]);
    return { ok: false, status: 404, json: async () => ({}) };
  });
}

describe('loadContent', () => {
  it('should return dictionaries and data when every fetch succeeds', async () => {
    // Arrange
    const fetchFn = fakeFetch();

    // Act
    const content = await loadContent('es', fetchFn);

    // Assert
    expect(content.dict).toEqual(FILES['content/es.json']);
    expect(content.fallbackDict).toEqual(FILES['content/en.json']);
    expect(content.profile).toEqual(FILES['content/profile.json']);
    expect(content.projects).toEqual(FILES['content/projects.json']);
    expect(content.caseStudies).toEqual(FILES['content/case-studies.json']);
    expect(fetchFn).toHaveBeenCalledTimes(5);
  });

  it('should throw ContentLoadError when a fetch fails', async () => {
    // Arrange
    const fetchFn = fakeFetch({ 'content/profile.json': async () => { throw new TypeError('Failed to fetch'); } });

    // Act
    const load = loadContent('en', fetchFn);

    // Assert
    await expect(load).rejects.toBeInstanceOf(ContentLoadError);
  });

  it('should throw ContentLoadError when a file answers with an error status', async () => {
    // Arrange
    const fetchFn = fakeFetch({ 'content/en.json': async () => ({ ok: false, status: 500, json: async () => ({}) }) });

    // Act
    const load = loadContent('en', fetchFn);

    // Assert
    await expect(load).rejects.toThrow(/content\/en\.json/);
  });

  it('should throw ContentLoadError when a file is not valid JSON', async () => {
    // Arrange
    const fetchFn = fakeFetch({
      'content/projects.json': async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token'); } }),
    });

    // Act
    const load = loadContent('en', fetchFn);

    // Assert
    await expect(load).rejects.toBeInstanceOf(ContentLoadError);
  });

  it('should fetch each file only once when loading again with a cache', async () => {
    // Arrange
    const fetchFn = fakeFetch();
    const cache = new Map();

    // Act
    await loadContent('en', fetchFn, cache);
    await loadContent('es', fetchFn, cache);

    // Assert
    expect(fetchFn).toHaveBeenCalledTimes(5);
  });
});
