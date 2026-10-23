import { h } from '../dom.js';
import { formatPeriod } from '../dates.js';

export function renderEducation({ t, lang, profile }) {
  return h('ul', { class: 'education' },
    profile.education.map((entry) => h('li', { class: 'education__item glass reveal', 'data-education': entry.id },
      h('h3', {}, t(`education.${entry.id}.degree`)),
      h('p', { class: 'education__institution' }, entry.institution),
      h('p', { class: 'education__period' }, formatPeriod(entry.start, entry.end, lang)),
      entry.hasProject
        ? h('p', { class: 'education__project' }, h('strong', {}, `${t('ui.education.degreeProject')}:`), ` ${t(`education.${entry.id}.project`)}`)
        : null)));
}
