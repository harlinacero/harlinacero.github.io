import { h } from '../dom.js';
import { renderHero } from './hero.js';
import { renderLeadership } from './leadership.js';
import { renderAbout } from './about.js';
import { renderCaseStudies } from './case-studies.js';
import { renderExperience } from './experience.js';
import { renderSkills } from './skills.js';
import { renderProjects } from './projects.js';
import { renderEducation } from './education.js';
import { renderCertifications } from './certifications.js';
import { renderLanguages } from './languages.js';
import { renderContact } from './contact.js';

/** Sections in business order (business spec UC-01 step 3). */
export const SECTION_ORDER = [
  { id: 'hero', render: renderHero, titled: false },
  { id: 'leadership', render: renderLeadership, nav: true },
  { id: 'about', render: renderAbout, nav: true },
  { id: 'architecture', render: (ctx, options) => renderCaseStudies(ctx, options.activeCaseStudy), nav: true },
  { id: 'experience', render: renderExperience, nav: true },
  { id: 'skills', render: renderSkills, nav: true },
  { id: 'projects', render: renderProjects, nav: true },
  { id: 'education', render: renderEducation, nav: true },
  { id: 'certifications', render: renderCertifications },
  { id: 'languages', render: renderLanguages },
  { id: 'contact', render: renderContact, nav: true },
];

function sectionHeader(id, t) {
  // Subtitles are optional: read the section texts as an object to avoid missing-key warnings.
  const { title, subtitle } = t('ui.sections')[id];
  return h('header', { class: 'section__header reveal' },
    h('h2', { id: `${id}-title`, class: 'section__title' }, title),
    subtitle ? h('p', { class: 'section__subtitle' }, subtitle) : null);
}

export function renderPage(main, ctx, options = {}) {
  main.replaceChildren(...SECTION_ORDER.map(({ id, render, titled = true }) => h('section', {
    id, class: `section section--${id}`, 'aria-labelledby': titled ? `${id}-title` : null, 'aria-label': titled ? null : ctx.profile.name,
  },
  titled ? sectionHeader(id, ctx.t) : null,
  render(ctx, options))));
}

export function renderNav({ t }) {
  return h('ul', { class: 'nav__list' },
    SECTION_ORDER.filter((section) => section.nav).map(({ id }) => h('li', {},
      h('a', { class: 'nav__link', href: `#${id}`, 'data-section': id }, t(`ui.nav.${id}`)))));
}
