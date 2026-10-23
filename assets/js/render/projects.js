import { h, externalLink, svgIcon } from '../dom.js';

function codeLinks(project, t, newTabLabel) {
  const viewCode = t('ui.actions.viewCode');
  const repos = [
    { repo: project.repo, label: project.mainLabelKey ? `${viewCode} · ${t(project.mainLabelKey)}` : viewCode },
    ...project.companions.map((companion) => ({ repo: companion.repo, label: `${viewCode} · ${t(companion.labelKey)}` })),
  ];
  return repos.map(({ repo, label }) => externalLink(repo, [svgIcon('github'), label],
    { class: 'button button--primary button--small', 'data-action': 'code', newTabLabel }));
}

function renderCard(project, t) {
  const newTabLabel = t('ui.actions.opensInNewTab');
  return h('article', { class: 'project-card glass reveal', 'data-project': project.id },
    h('h3', {}, project.name),
    h('p', { class: 'project-card__description' }, t(`projects.${project.id}.description`)),
    h('p', { class: 'project-card__demonstrates' }, t(`projects.${project.id}.demonstrates`)),
    h('ul', { class: 'chips' }, project.tags.map((tag) => h('li', { class: 'chip' }, tag))),
    h('div', { class: 'project-card__actions' },
      codeLinks(project, t, newTabLabel),
      project.demoUrl
        ? externalLink(project.demoUrl, [svgIcon('external'), t('ui.actions.liveDemo')],
          { class: 'button button--ghost button--small', 'data-action': 'demo', newTabLabel })
        : null,
      project.caseStudyId
        ? h('a', {
          class: 'button button--ghost button--small', href: `#case-${project.caseStudyId}`,
          'data-action': 'architecture', 'data-case-study': project.caseStudyId,
        }, svgIcon('diagram'), t('ui.actions.architecture'))
        : null));
}

export function renderProjects({ t, profile, projects }) {
  return h('div', { class: 'projects' },
    h('div', { class: 'projects__grid' }, projects.map((project) => renderCard(project, t))),
    h('p', { class: 'projects__more' },
      externalLink(profile.links.github, [svgIcon('github'), t('ui.actions.allRepositories')],
        { class: 'link-arrow', 'data-action': 'all-repositories', newTabLabel: t('ui.actions.opensInNewTab') })));
}
