import { h } from '../dom.js';
import { formatPeriod } from '../dates.js';

function renderRole(company, role, t, lang) {
  const base = `experience.${company.id}.roles.${role.id}`;
  return h('li', { class: 'role', 'data-role': role.id },
    h('h4', {}, t(`${base}.title`)),
    h('p', { class: 'role__period' }, formatPeriod(role.start, role.end, lang)),
    h('ul', { class: 'role__achievements' }, t(`${base}.achievements`).map((text) => h('li', {}, text))));
}

export function renderExperience({ t, lang, profile }) {
  return h('ol', { class: 'timeline' },
    profile.experience.map((company) => {
      const hasProgression = company.roles.length > 1;
      return h('li', { class: 'timeline__company glass reveal', 'data-company': company.id },
        h('header', {},
          h('h3', {}, company.company),
          h('p', { class: 'timeline__team' }, t(`experience.${company.id}.team`)),
          h('p', { class: 'timeline__location' }, company.location)),
        hasProgression ? h('p', { class: 'timeline__progression' }, t('ui.experience.progression')) : null,
        h('ol', { class: hasProgression ? 'roles roles--progression' : 'roles' },
          company.roles.map((role) => renderRole(company, role, t, lang))));
    }));
}
