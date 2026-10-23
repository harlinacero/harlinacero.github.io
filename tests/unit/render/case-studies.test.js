import { describe, it, expect } from 'vitest';
import { renderCaseStudies } from '../../../assets/js/render/case-studies.js';
import { contextFor, texts } from '../helpers.js';

describe('renderCaseStudies', () => {
  it('should show context, diagram, decisions with trade-offs, qualities and view code', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const studies = renderCaseStudies(ctx);

    // Assert
    const panel = studies.querySelector('#case-microservicesDemo');
    expect(panel.querySelector('h3').textContent).toBe('Microservices.Demo — insurance platform');
    expect(panel.querySelector('.case-study__context').textContent).toMatch(/^An insurance platform/);
    expect(panel.querySelector('.diagram')).not.toBeNull();
    expect(panel.querySelector('.diagram__description')).not.toBeNull();
    expect(panel.querySelectorAll('.decision')).toHaveLength(5);
    expect(panel.querySelector('.decision__trade-off').textContent).toMatch(/^Trade-off: /);
    expect(texts(panel, '.case-study__qualities .chip')).toEqual(['Scalability', 'Modifiability', 'Observability', 'Security']);
    const code = panel.querySelector('a[data-action="code"]');
    expect(code.getAttribute('href')).toBe('https://github.com/harlinacero/Microservices.Demo');
    expect(code.getAttribute('target')).toBe('_blank');
  });

  it('should render one tab per case study with the first one selected', () => {
    // Arrange
    const ctx = contextFor('en');

    // Act
    const studies = renderCaseStudies(ctx);

    // Assert
    const tabs = [...studies.querySelectorAll('[role="tab"]')];
    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(studies.querySelector('#case-employeeAttendanceControl').hidden).toBe(true);
  });

  it('should show the selected case study when a tab is clicked', () => {
    // Arrange
    const studies = renderCaseStudies(contextFor('en'));
    document.body.append(studies);

    // Act
    studies.querySelector('#tab-eCommerceMajestic').click();

    // Assert
    expect(studies.querySelector('#case-eCommerceMajestic').hidden).toBe(false);
    expect(studies.querySelector('#case-microservicesDemo').hidden).toBe(true);
    expect(studies.querySelector('#tab-eCommerceMajestic').getAttribute('aria-selected')).toBe('true');
    studies.remove();
  });

  it('should open the requested case study when rendering with an active id', () => {
    // Arrange
    const ctx = contextFor('es');

    // Act
    const studies = renderCaseStudies(ctx, 'employeeAttendanceControl');

    // Assert
    expect(studies.querySelector('#case-employeeAttendanceControl').hidden).toBe(false);
    expect(studies.querySelector('#case-microservicesDemo').hidden).toBe(true);
  });

  it('should move between tabs with the arrow keys', () => {
    // Arrange
    const studies = renderCaseStudies(contextFor('en'));
    document.body.append(studies);
    const first = studies.querySelector('#tab-microservicesDemo');

    // Act
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    // Assert
    expect(studies.querySelector('#tab-employeeAttendanceControl').getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement.id).toBe('tab-employeeAttendanceControl');
    studies.remove();
  });
});
