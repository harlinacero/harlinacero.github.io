import { describe, it, expect } from 'vitest';
import { renderExperience } from '../../../assets/js/render/experience.js';
import { contextFor, texts } from '../helpers.js';

describe('renderExperience', () => {
  it('should list companies newest first when rendering the timeline', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const timeline = renderExperience(ctx);

    // Assert
    expect(texts(timeline, '.timeline__company > header h3')).toEqual(['Mercado Libre', 'Siigo', 'Digitalware', 'PIV Ingeniería']);
    expect(timeline.querySelector('[data-company="mercadolibre"] .role__period').textContent).toBe('Apr 2025 – Sep 2026');
  });

  it('should render digitalware as one company with three roles in progression', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const timeline = renderExperience(ctx);

    // Assert
    const digitalware = timeline.querySelector('[data-company="digitalware"]');
    expect(texts(digitalware, '.role h4')).toEqual([
      'Coordinador de Desarrollo (Tech Lead)', 'Desarrollador de Software Sénior', 'Desarrollador de Software Junior',
    ]);
    expect(digitalware.querySelector('.timeline__progression').textContent).toBe('Progresión de carrera');
    expect(timeline.querySelector('[data-company="siigo"] .timeline__progression')).toBeNull();
  });

  it('should not list konrad lorenz as employer', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const timeline = renderExperience(ctx);

    // Assert
    expect(timeline.textContent).not.toMatch(/Konrad Lorenz/);
  });

  it('should describe 60000 daily productization requests when rendering mercado libre', () => {
    // Arrange
    const en = renderExperience(contextFor('en'));
    const es = renderExperience(contextFor('es'));

    // Act
    const enText = en.querySelector('[data-company="mercadolibre"]').textContent;
    const esText = es.querySelector('[data-company="mercadolibre"]').textContent;

    // Assert
    expect(enText).toContain('peaks of 60,000 productization requests per day, all processed without failures');
    expect(esText).toContain('picos de 60.000 solicitudes de productización diarias, todas procesadas sin fallos');
  });
});
