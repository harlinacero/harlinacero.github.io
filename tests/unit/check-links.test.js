import { describe, it, expect, vi } from 'vitest';
import { checkLinks, collectLinks } from '../../scripts/check-links.mjs';

const response = (status) => ({ status, ok: status >= 200 && status < 300 });
const fetchAnswering = (statusByUrl) => vi.fn(async (url) => response(statusByUrl[url] ?? 200));
const options = (overrides = {}) => ({ fetchFn: fetchAnswering({}), exists: () => true, retries: 2, delayMs: 0, ...overrides });

describe('checkLinks', () => {
  it('should fail naming the url when a link answers 404', async () => {
    // Arrange
    const fetchFn = fetchAnswering({ 'https://github.com/harlinacero/gone': 404 });

    // Act
    const { broken } = await checkLinks(['https://github.com/harlinacero/gone', 'https://github.com/harlinacero'], options({ fetchFn }));

    // Assert
    expect(broken).toEqual([{ url: 'https://github.com/harlinacero/gone', reason: 'HTTP 404' }]);
  });

  it('should pass when every link answers 2xx', async () => {
    // Arrange / Act
    const { broken, warnings } = await checkLinks(['https://github.com/harlinacero/Microservices.Demo'], options());

    // Assert
    expect(broken).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('should warn but not fail when linkedin answers 999', async () => {
    // Arrange
    const fetchFn = fetchAnswering({ 'https://www.linkedin.com/in/harlinacero': 999 });

    // Act
    const { broken, warnings } = await checkLinks(['https://www.linkedin.com/in/harlinacero'], options({ fetchFn }));

    // Assert
    expect(broken).toEqual([]);
    expect(warnings[0].url).toBe('https://www.linkedin.com/in/harlinacero');
  });

  it('should fail when a local file path does not exist', async () => {
    // Arrange
    const exists = (path) => path !== 'assets/cv/missing.pdf';

    // Act
    const { broken } = await checkLinks(['assets/cv/missing.pdf', 'assets/img/harlin-acero.jpg'], options({ exists }));

    // Assert
    expect(broken).toEqual([{ url: 'assets/cv/missing.pdf', reason: 'file not found' }]);
  });

  it('should retry before failing when the request errors', async () => {
    // Arrange
    const fetchFn = vi.fn()
      .mockRejectedValueOnce(new TypeError('network'))
      .mockResolvedValueOnce(response(200));

    // Act
    const { broken } = await checkLinks(['https://github.com/harlinacero'], options({ fetchFn }));

    // Assert
    expect(broken).toEqual([]);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('should fall back to GET when HEAD is not allowed', async () => {
    // Arrange
    const fetchFn = vi.fn(async (_url, init) => response(init.method === 'HEAD' ? 405 : 200));

    // Act
    const { broken } = await checkLinks(['https://example.org/'], options({ fetchFn }));

    // Assert
    expect(broken).toEqual([]);
    expect(fetchFn.mock.calls.map(([, init]) => init.method)).toEqual(['HEAD', 'GET']);
  });

  it('should check own-site urls as local files', async () => {
    // Arrange
    const fetchFn = vi.fn();
    const exists = vi.fn(() => true);

    // Act
    await checkLinks(['https://harlinacero.github.io/assets/img/og-image.png'], options({ fetchFn, exists }));

    // Assert
    expect(exists).toHaveBeenCalledWith('assets/img/og-image.png');
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('collectLinks', () => {
  it('should collect urls and local paths from content and html, skipping anchors and mailto', () => {
    // Arrange
    const json = { links: { github: 'https://github.com/harlinacero' }, cv: { en: 'assets/cv/a.pdf' }, text: 'not a link' };
    const html = '<a href="#projects">x</a><a href="mailto:a@b.c">m</a><img src="assets/img/p.jpg"><link href="https://harlinacero.github.io/">';

    // Act
    const links = collectLinks([json], [html]);

    // Assert
    expect(links.sort()).toEqual(['assets/cv/a.pdf', 'assets/img/p.jpg', 'https://github.com/harlinacero', 'https://harlinacero.github.io/'].sort());
  });
});
