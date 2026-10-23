import { h } from '../dom.js';

export function renderLeadership({ t, profile }) {
  return h('div', { class: 'leadership-grid' },
    profile.leadership.map((id) => h('article', { class: 'highlight glass reveal', 'data-highlight': id },
      h('p', { class: 'highlight__metric gradient-text' }, t(`leadership.${id}.metric`)),
      h('h3', {}, t(`leadership.${id}.title`)),
      h('p', {}, t(`leadership.${id}.text`)))));
}
