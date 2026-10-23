// BR-08: the phone number is never published, neither in the pages nor inside the PDFs.
// EXTRA_PDF=<path> adds a PDF to the scan (used once to prove the detector fires on the
// original, unredacted CV).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { extractText, getDocumentProxy, getMeta } from 'unpdf';

const PHONE = /3\D{0,3}1\D{0,3}2\D{0,3}3\D{0,3}8\D{0,3}7\D{0,3}9\D{0,3}0\D{0,3}4\D{0,3}6/;
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt', '.md', '.xml', '.webmanifest']);
const PUBLISHABLE = ['index.html', 'assets', 'content'];

function listFiles(path) {
  const absolute = resolve(process.cwd(), path);
  if (!statSync(absolute).isDirectory()) return [absolute];
  return readdirSync(absolute).flatMap((name) => listFiles(join(path, name)));
}

const publishableFiles = PUBLISHABLE.flatMap(listFiles);
const pdfFiles = [...publishableFiles.filter((file) => extname(file) === '.pdf'), ...(process.env.EXTRA_PDF ? [process.env.EXTRA_PDF] : [])];

async function pdfText(file) {
  const pdf = await getDocumentProxy(new Uint8Array(readFileSync(file)));
  const { text } = await extractText(pdf, { mergePages: true });
  const { info } = await getMeta(pdf);
  return `${text}\n${JSON.stringify(info)}`;
}

describe('phone number is never published', () => {
  it('should detect the phone number in any formatting', () => {
    // Arrange
    const samples = ['+57 312 387 9046', '3123879046', '312-387-9046', '(312) 387 9046', '312.387.9046'];

    // Act / Assert
    samples.forEach((sample) => expect(sample).toMatch(PHONE));
    expect('harlinacero@gmail.com · Bogotá 2025-04').not.toMatch(PHONE);
  });

  it('should not contain the phone number when scanning every publishable text file', () => {
    // Arrange
    const textFiles = publishableFiles.filter((file) => TEXT_EXTENSIONS.has(extname(file)));

    // Act
    const offenders = textFiles.filter((file) => PHONE.test(readFileSync(file, 'utf-8')));

    // Assert
    expect(textFiles.length).toBeGreaterThan(5);
    expect(offenders).toEqual([]);
  });

  it('should not contain the phone number when extracting text from every pdf', async () => {
    // Arrange
    expect(pdfFiles.length).toBeGreaterThanOrEqual(2);

    // Act
    const offenders = [];
    for (const file of pdfFiles) {
      if (PHONE.test(await pdfText(file))) offenders.push(file);
    }

    // Assert
    expect(offenders).toEqual([]);
  });
});
