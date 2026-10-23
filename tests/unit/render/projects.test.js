import { describe, it, expect } from 'vitest';
import { renderProjects } from '../../../assets/js/render/projects.js';
import { contextFor, texts } from '../helpers.js';

const withProjects = (lang, projects) => ({ ...contextFor(lang), projects });

describe('renderProjects', () => {
  it('should render cards in configured order with description and tags', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const section = renderProjects(ctx);

    // Assert
    expect(texts(section, '.project-card h3')).toEqual(['Microservices.Demo', 'EmployeeAttendanceControl', 'E-Commerce Majestic', 'EasyReportsIA', 'Medical Center']);
    const first = section.querySelector('[data-project="microservicesDemo"]');
    expect(first.querySelector('.project-card__description').textContent).toMatch(/^Plataforma de seguros/);
    expect(texts(first, '.chip')).toContain('RabbitMQ');
  });

  it('should open the repository in a new tab when rendering view code', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const section = renderProjects(ctx);

    // Assert
    const link = section.querySelector('[data-project="employeeAttendanceControl"] a[data-action="code"]');
    expect(link.getAttribute('href')).toBe('https://github.com/harlinacero/EmployeeAttendanceControl');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.textContent).toContain('View code');
  });

  it('should include a link to the github profile', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const section = renderProjects(ctx);

    // Assert
    const profileLink = section.querySelector('a[data-action="all-repositories"]');
    expect(profileLink.getAttribute('href')).toBe('https://github.com/harlinacero');
    expect(profileLink.getAttribute('target')).toBe('_blank');
  });

  it('should show live demo when the project has a demo url', () => {
    // Arrange
    const project = { ...contextFor('en').projects[4], demoUrl: 'https://example.org/demo' };
    const ctx = withProjects('en', [project]);

    // Act
    const section = renderProjects(ctx);

    // Assert
    const demo = section.querySelector('a[data-action="demo"]');
    expect(demo.getAttribute('href')).toBe('https://example.org/demo');
    expect(demo.getAttribute('target')).toBe('_blank');
    expect(demo.textContent).toContain('Live demo');
  });

  it('should not show live demo when the project has no demo url', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const section = renderProjects(ctx);

    // Assert
    expect(section.querySelectorAll('a[data-action="demo"]')).toHaveLength(0);
  });

  it('should show both repositories with distinct labels when the project has a companion', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const section = renderProjects(ctx);

    // Assert
    const links = [...section.querySelectorAll('[data-project="easyReportsIA"] a[data-action="code"]')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'https://github.com/harlinacero/EasyReportsIA', 'https://github.com/harlinacero/easyreports',
    ]);
    expect(links[0].textContent).toContain('API (.NET)');
    expect(links[1].textContent).toContain('Web app (React)');
  });

  it('should not show the architecture action when the project has no case study', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const section = renderProjects(ctx);

    // Assert
    expect(section.querySelector('[data-project="medicalcenter"] [data-action="architecture"]')).toBeNull();
    const architecture = section.querySelector('[data-project="microservicesDemo"] [data-action="architecture"]');
    expect(architecture.getAttribute('href')).toBe('#case-microservicesDemo');
  });
});
