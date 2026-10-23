import { describe, it, expect } from 'vitest';
import { formatPeriod } from '../../assets/js/dates.js';

describe('formatPeriod', () => {
  it('should format the period in english when lang is en', () => {
    // Arrange / Act
    const period = formatPeriod('2025-04', '2026-09', 'en');

    // Assert
    expect(period).toBe('Apr 2025 – Sep 2026');
  });

  it('should format the period in spanish when lang is es', () => {
    // Arrange / Act
    const period = formatPeriod('2025-04', '2026-09', 'es');

    // Assert
    expect(period).toBe('abr 2025 – sep 2026');
  });

  it('should show only years when given years', () => {
    // Arrange / Act / Assert
    expect(formatPeriod(2014, 2018, 'es')).toBe('2014 – 2018');
  });

  it('should show a single year when there is no start', () => {
    // Arrange / Act / Assert
    expect(formatPeriod(undefined, 2019, 'en')).toBe('2019');
  });
});
