import { describe, it, expect } from 'vitest';
import { renderHero } from '../../../assets/js/render/hero.js';
import { contextFor } from '../helpers.js';

describe('renderHero', () => {
  it.each([
    ['en', 'Software Engineer & Software Architect', '10+ years · Tech Lead · Microservices · Cloud (Azure)', 'Portrait of Harlin Acero'],
    ['es', 'Ingeniero de Software y Arquitecto de Software', '+10 años · Tech Lead · Microservicios · Cloud (Azure)', 'Retrato de Harlin Acero'],
  ])('should show photo with alt, name, headline and tagline when rendering in %s', (lang, headline, tagline, alt) => {
    // Arrange
    const ctx = contextFor(lang);

    // Act
    const hero = renderHero(ctx);

    // Assert
    const photo = hero.querySelector('img.hero__photo');
    expect(photo.getAttribute('src')).toBe('assets/img/harlin-acero.jpg');
    expect(photo.getAttribute('alt')).toBe(alt);
    expect(hero.querySelector('h1').textContent).toBe('Harlin Acero');
    expect(hero.querySelector('.hero__headline').textContent).toBe(headline);
    expect(hero.querySelector('.hero__tagline').textContent).toBe(tagline);
    expect(hero.querySelector('.hero__location').textContent).toContain('Bogotá, Colombia');
  });

  it('should show projects, contact and download actions', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const hero = renderHero(ctx);

    // Assert
    const actions = [...hero.querySelectorAll('.hero__actions a')];
    expect(actions.map((a) => a.getAttribute('href'))).toEqual(['#projects', '#contact', 'assets/cv/harlin-acero-cv-en.pdf']);
    expect(actions[2].hasAttribute('download')).toBe(true);
    expect(actions[2].textContent).toContain('Download CV');
  });

  it('should render the complete first typing line so it reads well without animation', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const hero = renderHero(ctx);

    // Assert
    const typing = hero.querySelector('[data-typing]');
    expect(typing.textContent).toBe('diseñando sistemas distribuidos');
    expect(JSON.parse(typing.dataset.typing)).toHaveLength(3);
  });

  it('should not show any availability badge', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const hero = renderHero(ctx);

    // Assert
    expect(hero.textContent).not.toMatch(/open to work|available|disponible/i);
  });
});
