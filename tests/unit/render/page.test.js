import { describe, it, expect } from 'vitest';
import { renderPage, renderNav, SECTION_ORDER } from '../../../assets/js/render/index.js';
import { contextFor, texts } from '../helpers.js';

describe('renderPage', () => {
  it('should render sections in business order when rendering the page', () => {
    // Arrange
    const main = document.createElement('main');

    // Act
    renderPage(main, contextFor('en'));

    // Assert
    expect([...main.querySelectorAll(':scope > section')].map((s) => s.id)).toEqual([
      'hero', 'leadership', 'about', 'architecture', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages', 'contact',
    ]);
    expect(SECTION_ORDER).toHaveLength(11);
  });

  it('should title each section in the current language and label it for assistive technology', () => {
    // Arrange
    const main = document.createElement('main');

    // Act
    renderPage(main, contextFor('es'));

    // Assert
    const projects = main.querySelector('#projects');
    expect(projects.querySelector('h2').textContent).toBe('Proyectos destacados');
    expect(projects.getAttribute('aria-labelledby')).toBe('projects-title');
    expect(main.querySelector('#hero h2')).toBeNull();
  });

  it('should replace the previous content when rendering again', () => {
    // Arrange
    const main = document.createElement('main');
    renderPage(main, contextFor('en'));

    // Act
    renderPage(main, contextFor('es'), { activeCaseStudy: 'eCommerceMajestic' });

    // Assert
    expect(main.querySelectorAll('#projects')).toHaveLength(1);
    expect(main.querySelector('#case-eCommerceMajestic').hidden).toBe(false);
  });
});

describe('renderNav', () => {
  it('should link every main section in the current language', () => {
    // Arrange / Act
    const nav = renderNav(contextFor('en'));

    // Assert
    expect([...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual([
      '#leadership', '#about', '#architecture', '#experience', '#skills', '#projects', '#education', '#contact',
    ]);
    expect(texts(nav, 'a')[0]).toBe('Leadership');
  });
});
