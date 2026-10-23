import { describe, it, expect } from 'vitest';
import { renderDiagram, describeDiagram } from '../../../assets/js/render/diagram.js';
import { contextFor, texts } from '../helpers.js';

const studyOf = (ctx, id) => ctx.caseStudies.find((study) => study.id === id);

describe('renderDiagram', () => {
  it('should render every layer and node when given a topology', () => {
    // Arrange
    const ctx = contextFor('en');
    const study = studyOf(ctx, 'employeeAttendanceControl');

    // Act
    const diagram = renderDiagram(study, ctx);

    // Assert
    expect(texts(diagram, '.diagram__layer-label')).toEqual(['Clients', 'Edge', 'Services', 'Messaging', 'Data']);
    expect(diagram.querySelectorAll('.diagram__node')).toHaveLength(9);
    expect(diagram.querySelector('[data-node="mongo"] .diagram__node-tech').textContent).toBe('MongoDB');
    expect(diagram.querySelector('.diagram__frame').getAttribute('tabindex')).toBe('0');
  });

  it('should label the diagram in spanish when rendering in spanish', () => {
    // Arrange
    const ctx = contextFor('es');
    const study = studyOf(ctx, 'microservicesDemo');

    // Act
    const diagram = renderDiagram(study, ctx);

    // Assert
    expect(diagram.querySelector('[data-node="policy"] .diagram__node-label').textContent).toBe('Servicio de Pólizas');
    expect(texts(diagram, '.diagram__layer-label')[0]).toBe('Clientes');
  });
});

describe('describeDiagram', () => {
  it('should describe components and interactions in text when asked for the alternative', () => {
    // Arrange
    const ctx = contextFor('en');
    const study = studyOf(ctx, 'employeeAttendanceControl');

    // Act
    const { components, interactions } = describeDiagram(study, ctx.t, ctx.caseStudies);

    // Assert
    expect(components).toContain('Data: Attendance history store (MongoDB), owned by Attendances service');
    expect(interactions).toContain('Employees service → Message broker: publishes EmployeeCreateEvent and AttendanceStateChangedEvent (asynchronous)');
    expect(interactions).toHaveLength(8);
  });

  it('should join several sources and targets when an interaction has many', () => {
    // Arrange
    const ctx = contextFor('es');
    const study = studyOf(ctx, 'eCommerceMajestic');

    // Act
    const { interactions } = describeDiagram(study, ctx.t);

    // Assert
    expect(interactions).toContain('Plataforma de contenedores → Aplicación web Angular, API REST en Go: ejecuta y escala los contenedores de frontend y backend (configuración)');
  });
});
