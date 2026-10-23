import { h } from '../dom.js';

export function renderAbout({ t }) {
  return h('div', { class: 'about glass' }, t('profile.summary').map((paragraph) => h('p', {}, paragraph)));
}
