import { h, externalLink, svgIcon } from '../dom.js';
import { renderDiagram } from './diagram.js';

export function selectCaseStudy(container, id, { focus = false } = {}) {
  container.querySelectorAll('[role="tab"]').forEach((tab) => {
    const selected = tab.dataset.caseStudy === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  container.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    panel.hidden = panel.dataset.caseStudy !== id;
  });
  container.dataset.active = id;
}

const KEY_OFFSETS = { ArrowRight: 1, ArrowLeft: -1 };

function onTabKeydown(event, container, ids) {
  const current = ids.indexOf(container.dataset.active);
  let next;
  if (event.key in KEY_OFFSETS) next = ids[(current + KEY_OFFSETS[event.key] + ids.length) % ids.length];
  else if (event.key === 'Home') next = ids[0];
  else if (event.key === 'End') next = ids[ids.length - 1];
  if (!next) return;
  event.preventDefault();
  selectCaseStudy(container, next, { focus: true });
}

function renderPanel(study, ctx, isActive) {
  const { t } = ctx;
  const base = `caseStudies.${study.id}`;
  return h('article', {
    class: 'case-study glass', id: `case-${study.id}`, role: 'tabpanel', 'data-case-study': study.id,
    'aria-labelledby': `tab-${study.id}`, tabindex: -1, hidden: !isActive,
  },
  h('h3', {}, t(`${base}.title`)),
  h('div', { class: 'case-study__body' },
    h('div', { class: 'case-study__intro' },
      h('h4', {}, t('ui.caseStudy.context')),
      h('p', { class: 'case-study__context' }, t(`${base}.context`)),
      h('h4', {}, t('ui.caseStudy.qualities')),
      h('ul', { class: 'chips case-study__qualities' },
        study.qualities.map((id) => h('li', { class: 'chip chip--accent' }, t(`ui.qualities.${id}`)))),
      externalLink(study.repo, [svgIcon('github'), t('ui.actions.viewCode')],
        { class: 'button button--primary button--small', 'data-action': 'code', newTabLabel: t('ui.actions.opensInNewTab') })),
    renderDiagram(study, ctx)),
  h('h4', {}, t('ui.caseStudy.decisions')),
  h('ol', { class: 'decisions' },
    study.decisions.map((id) => h('li', { class: 'decision' },
      h('p', { class: 'decision__text' }, h('strong', {}, `${t('ui.caseStudy.decision')}: `), t(`${base}.decisions.${id}.decision`)),
      h('p', { class: 'decision__trade-off' }, h('strong', {}, `${t('ui.caseStudy.tradeOff')}: `), t(`${base}.decisions.${id}.tradeOff`))))));
}

export function renderCaseStudies(ctx, activeId = undefined) {
  const { t, caseStudies, projects } = ctx;
  const ids = caseStudies.map((study) => study.id);
  const active = ids.includes(activeId) ? activeId : ids[0];
  const projectName = (study) => projects.find((project) => project.id === study.projectId)?.name ?? study.id;

  const container = h('div', { class: 'case-studies', 'data-active': active });
  const tablist = h('div', { class: 'case-studies__tabs', role: 'tablist', 'aria-label': t('ui.sections.architecture.title') },
    caseStudies.map((study) => h('button', {
      type: 'button', role: 'tab', class: 'tab', id: `tab-${study.id}`, 'data-case-study': study.id,
      'aria-controls': `case-${study.id}`, 'aria-selected': String(study.id === active), tabindex: study.id === active ? 0 : -1,
      onClick: () => selectCaseStudy(container, study.id),
      onKeydown: (event) => onTabKeydown(event, container, ids),
    }, projectName(study))));

  container.append(tablist, ...caseStudies.map((study) => renderPanel(study, ctx, study.id === active)));
  return container;
}
