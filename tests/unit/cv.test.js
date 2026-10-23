import { describe, it, expect } from 'vitest';
import { resolveCvDownload } from '../../assets/js/cv.js';

const CV = { en: 'assets/cv/harlin-acero-cv-en.pdf', es: 'assets/cv/harlin-acero-cv-es.pdf' };

describe('resolveCvDownload', () => {
  it('should return the current language pdf when it exists', () => {
    // Arrange / Act
    const download = resolveCvDownload('en', CV);

    // Assert
    expect(download).toEqual({ href: CV.en, labelKey: 'ui.actions.downloadCv', isFallback: false });
  });

  it('should return the spanish pdf flagged as fallback when the current language pdf is missing', () => {
    // Arrange / Act
    const download = resolveCvDownload('en', { es: CV.es });

    // Assert
    expect(download).toEqual({ href: CV.es, labelKey: 'ui.actions.downloadCvFallback', isFallback: true });
  });

  it('should not flag spanish as fallback when the site is in spanish', () => {
    // Arrange / Act
    const download = resolveCvDownload('es', { es: CV.es });

    // Assert
    expect(download.isFallback).toBe(false);
    expect(download.labelKey).toBe('ui.actions.downloadCv');
  });
});
