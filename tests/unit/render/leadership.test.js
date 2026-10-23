import { describe, it, expect } from 'vitest';
import { renderLeadership } from '../../../assets/js/render/leadership.js';
import { renderAbout } from '../../../assets/js/render/about.js';
import { contextFor, texts } from '../helpers.js';

describe('renderLeadership', () => {
  it('should render every leadership highlight with metric and text', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const leadership = renderLeadership(ctx);

    // Assert
    expect(texts(leadership, '.highlight__metric')).toEqual(['6+', '10+', '60K', '300K+', 'CI/CD', '3×/day']);
    expect(leadership.querySelectorAll('.highlight h3')).toHaveLength(6);
    expect(leadership.querySelectorAll('.highlight p:not(.highlight__metric)')).toHaveLength(6);
  });
});

describe('renderAbout', () => {
  it('should render the three summary paragraphs', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const about = renderAbout(ctx);

    // Assert
    const paragraphs = texts(about, 'p');
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toMatch(/^Ingeniero de Software y Arquitecto de Software/);
  });
});
