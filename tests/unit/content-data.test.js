import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readJson = (file) => JSON.parse(readFileSync(resolve(process.cwd(), file), 'utf-8'));

const en = readJson('content/en.json');
const es = readJson('content/es.json');
const profile = readJson('content/profile.json');
const projects = readJson('content/projects.json');
const caseStudies = readJson('content/case-studies.json');

const lookup = (dict, path) => path.split('.').reduce((node, key) => node?.[key], dict);

/** Text paths referenced by the language-neutral data that are missing in a dictionary. */
function unresolved(paths) {
  return paths.flatMap((path) => [
    ...(lookup(en, path) === undefined ? [`en:${path}`] : []),
    ...(lookup(es, path) === undefined ? [`es:${path}`] : []),
  ]);
}

function referencedPaths() {
  const paths = [];
  profile.leadership.forEach((id) => paths.push(`leadership.${id}.metric`, `leadership.${id}.title`, `leadership.${id}.text`));
  profile.experience.forEach((company) => {
    paths.push(`experience.${company.id}.team`);
    company.roles.forEach((role) => paths.push(`experience.${company.id}.roles.${role.id}.title`, `experience.${company.id}.roles.${role.id}.achievements`));
  });
  profile.skills.forEach((id) => paths.push(`skills.${id}.title`, `skills.${id}.items`));
  profile.education.forEach((entry) => {
    paths.push(`education.${entry.id}.degree`);
    if (entry.hasProject) paths.push(`education.${entry.id}.project`);
  });
  profile.certifications.forEach((cert) => paths.push(`certifications.${cert.id}`));
  profile.languages.forEach((id) => paths.push(`languages.${id}.name`, `languages.${id}.level`));
  projects.forEach((project) => {
    paths.push(`projects.${project.id}.description`, `projects.${project.id}.demonstrates`);
    if (project.mainLabelKey) paths.push(project.mainLabelKey);
    project.companions.forEach((companion) => paths.push(companion.labelKey));
  });
  caseStudies.forEach((study) => {
    paths.push(`caseStudies.${study.id}.title`, `caseStudies.${study.id}.context`);
    study.layers.forEach((layer) => {
      paths.push(`ui.layers.${layer.id}`);
      layer.nodes.forEach((node) => paths.push(`caseStudies.${study.id}.nodes.${node.id}`));
    });
    study.interactions.forEach((interaction) => {
      paths.push(`caseStudies.${study.id}.interactions.${interaction.id}`, `ui.interactionKinds.${interaction.kind}`);
    });
    study.decisions.forEach((id) => paths.push(`caseStudies.${study.id}.decisions.${id}.decision`, `caseStudies.${study.id}.decisions.${id}.tradeOff`));
    study.qualities.forEach((id) => paths.push(`ui.qualities.${id}`));
  });
  return paths;
}

describe('language-neutral content data', () => {
  it('should reference only existing text keys when profile, projects and case studies are combined', () => {
    // Arrange
    const paths = referencedPaths();

    // Act
    const missing = unresolved(paths);

    // Assert
    expect(missing, `unresolved text keys: ${missing.join(', ')}`).toEqual([]);
  });

  it('should list the featured projects in the configured order', () => {
    // Arrange
    const excluded = ['BuscadorPHP', 'ChatRealTime', 'etl-python.-excersice', 'Microservices.Demo-config', 'mslearn-microservices-devops-aspnet-core', 'python-ml-course'];

    // Act
    const ids = projects.map((project) => project.id);
    const repos = projects.flatMap((project) => [project.repo, ...project.companions.map((c) => c.repo)]);

    // Assert
    expect(ids).toEqual(['microservicesDemo', 'employeeAttendanceControl', 'eCommerceMajestic', 'easyReportsIA', 'medicalcenter']);
    excluded.forEach((name) => expect(repos.some((repo) => repo.endsWith(`/${name}`))).toBe(false));
    repos.forEach((repo) => expect(repo).toMatch(/^https:\/\/github\.com\/harlinacero\/[\w.-]+$/));
  });

  it('should list the experience newest first with digitalware as one company with three roles', () => {
    // Arrange / Act
    const companies = profile.experience.map((company) => company.id);
    const digitalware = profile.experience.find((company) => company.id === 'digitalware');
    const starts = profile.experience.map((company) => company.roles[0].start);

    // Assert
    expect(companies).toEqual(['mercadolibre', 'siigo', 'digitalware', 'piv']);
    expect(digitalware.roles.map((role) => role.id)).toEqual(['techLead', 'senior', 'junior']);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it('should define three case studies when loading case-studies.json', () => {
    // Arrange / Act
    const ids = caseStudies.map((study) => study.id);

    // Assert
    expect(ids).toEqual(['microservicesDemo', 'employeeAttendanceControl', 'eCommerceMajestic']);
    caseStudies.forEach((study) => {
      expect(study.decisions.length).toBeGreaterThanOrEqual(3);
      expect(study.decisions.length).toBeLessThanOrEqual(5);
      expect(projects.find((project) => project.id === study.projectId)?.caseStudyId).toBe(study.id);
    });
  });

  it('should connect only existing nodes when defining case study interactions', () => {
    // Arrange / Act
    const problems = caseStudies.flatMap((study) => {
      const nodeIds = new Set(study.layers.flatMap((layer) => layer.nodes.map((node) => node.id)));
      const fromInteractions = study.interactions.flatMap((interaction) =>
        [...interaction.from, ...interaction.to].filter((id) => !nodeIds.has(id)).map((id) => `${study.id}.${interaction.id}:${id}`));
      const fromOwners = study.layers.flatMap((layer) => layer.nodes)
        .filter((node) => node.ownedBy && !nodeIds.has(node.ownedBy))
        .map((node) => `${study.id}.${node.id}.ownedBy:${node.ownedBy}`);
      return [...fromInteractions, ...fromOwners];
    });

    // Assert
    expect(problems).toEqual([]);
  });

  it('should keep the configured cv files and contact links when loading the profile', () => {
    // Arrange / Act
    const { cv, links, email } = profile;

    // Assert
    expect(cv).toEqual({ en: 'assets/cv/harlin-acero-cv-en.pdf', es: 'assets/cv/harlin-acero-cv-es.pdf' });
    expect(links.linkedin).toBe('https://www.linkedin.com/in/harlinacero');
    expect(links.github).toBe('https://github.com/harlinacero');
    expect(email).toBe('harlinacero@gmail.com');
    expect(profile).not.toHaveProperty('phone');
  });
});
