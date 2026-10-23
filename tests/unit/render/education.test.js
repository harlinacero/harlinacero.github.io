import { describe, it, expect } from 'vitest';
import { renderEducation } from '../../../assets/js/render/education.js';
import { renderCertifications } from '../../../assets/js/render/certifications.js';
import { renderLanguages } from '../../../assets/js/render/languages.js';
import { contextFor, texts } from '../helpers.js';

describe('renderEducation', () => {
  it('should show the degree project under the systems engineering degree', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const education = renderEducation(ctx);

    // Assert
    const degree = education.querySelector('[data-education="systemsEngineering"]');
    expect(degree.querySelector('h3').textContent).toBe('B.Sc. in Systems Engineering');
    expect(degree.textContent).toContain('Fundación Universitaria Konrad Lorenz');
    expect(degree.querySelector('.education__period').textContent).toBe('2014 – 2018');
    expect(degree.querySelector('.education__project').textContent)
      .toBe("Degree project: Information-management system for the university's Clinical Psychology Center.");
    expect(education.querySelectorAll('.education__project')).toHaveLength(1);
  });
});

describe('renderCertifications', () => {
  it('should mark certifications in preparation', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const certifications = renderCertifications(ctx);

    // Assert
    expect(certifications.querySelectorAll('li')).toHaveLength(5);
    expect(texts(certifications, '[data-status="inProgress"] .badge')).toEqual(['En preparación', 'En preparación']);
  });
});

describe('renderLanguages', () => {
  it('should list spanish and english with their level', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const languages = renderLanguages(ctx);

    // Assert
    expect(texts(languages, 'dt')).toEqual(['Spanish', 'English']);
    expect(texts(languages, 'dd')[0]).toBe('Native');
  });
});
