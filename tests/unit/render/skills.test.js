import { describe, it, expect } from 'vitest';
import { renderSkills } from '../../../assets/js/render/skills.js';
import { contextFor, texts } from '../helpers.js';

describe('renderSkills', () => {
  it('should list architecture first when rendering skill groups', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const skills = renderSkills(ctx);

    // Assert
    const titles = texts(skills, '.skill-group h3');
    expect(titles[0]).toBe('Architecture');
    expect(titles[1]).toBe('Leadership');
    expect(titles).toHaveLength(7);
    expect(texts(skills, '.skill-group:first-child li')).toContain('Microservices');
  });
});
