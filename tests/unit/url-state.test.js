import { describe, it, expect } from 'vitest';
import { readUrlLang, readHashSection, buildUrlWithLang } from '../../assets/js/url-state.js';

const at = (href) => new URL(href);

describe('url-state', () => {
  it('should read the lang query parameter when present', () => {
    // Arrange
    const location = at('https://harlinacero.github.io/?lang=es#projects');

    // Act
    const lang = readUrlLang(location);

    // Assert
    expect(lang).toBe('es');
  });

  it('should return null when lang is absent', () => {
    // Arrange
    const location = at('https://harlinacero.github.io/');

    // Act
    const lang = readUrlLang(location);

    // Assert
    expect(lang).toBeNull();
  });

  it('should read the section id from the hash', () => {
    // Arrange
    const location = at('https://harlinacero.github.io/?lang=en#experience');

    // Act
    const section = readHashSection(location);

    // Assert
    expect(section).toBe('experience');
  });

  it('should return null when the hash is empty', () => {
    // Arrange
    const location = at('https://harlinacero.github.io/#');

    // Act
    const section = readHashSection(location);

    // Assert
    expect(section).toBeNull();
  });

  it('should set lang and keep the hash when building a shareable url', () => {
    // Arrange
    const location = at('https://harlinacero.github.io/?lang=en#projects');

    // Act
    const url = buildUrlWithLang(location, 'es');

    // Assert
    expect(url).toBe('/?lang=es#projects');
  });
});
