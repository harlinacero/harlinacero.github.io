import { describe, it, expect } from 'vitest';
import { renderContact } from '../../../assets/js/render/contact.js';
import { contextFor } from '../helpers.js';

describe('renderContact', () => {
  it('should render mailto, linkedin and github links', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const contact = renderContact(ctx);

    // Assert
    expect(contact.querySelector('a[data-action="email"]').getAttribute('href')).toBe('mailto:harlinacero@gmail.com');
    expect(contact.querySelector('[data-email]').textContent).toBe('harlinacero@gmail.com');
    const linkedin = contact.querySelector('a[data-action="linkedin"]');
    expect(linkedin.getAttribute('href')).toBe('https://www.linkedin.com/in/harlinacero');
    expect(linkedin.getAttribute('target')).toBe('_blank');
    expect(contact.querySelector('a[data-action="github"]').getAttribute('href')).toBe('https://github.com/harlinacero');
    expect(contact.querySelector('button[data-action="copy-email"]').textContent).toContain('Copy email');
    expect(contact.querySelector('[data-copy-status]').getAttribute('aria-live')).toBe('polite');
  });

  it('should offer the cv of the current language', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const contact = renderContact(ctx);

    // Assert
    const download = contact.querySelector('a[data-action="download-cv"]');
    expect(download.getAttribute('href')).toBe('assets/cv/harlin-acero-cv-es.pdf');
    expect(download.textContent).toContain('Descargar CV');
  });

  it('should label the download as spanish when falling back', () => {
    // Arrange
    const base = contextFor('en');
    const ctx = { ...base, profile: { ...base.profile, cv: { es: 'assets/cv/harlin-acero-cv-es.pdf' } } };

    // Act
    const contact = renderContact(ctx);

    // Assert
    const download = contact.querySelector('a[data-action="download-cv"]');
    expect(download.getAttribute('href')).toBe('assets/cv/harlin-acero-cv-es.pdf');
    expect(download.textContent).toContain('Download CV (Spanish)');
  });

  it('should never show a phone number', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const contact = renderContact(ctx);

    // Assert
    expect(contact.textContent).not.toMatch(/\+?57|\d{3}\s?\d{3}\s?\d{4}/);
    expect(contact.querySelector('a[href^="tel:"]')).toBeNull();
  });
});
