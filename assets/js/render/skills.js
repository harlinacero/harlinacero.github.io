import { h } from '../dom.js';

export function renderSkills({ t, profile }) {
  return h('div', { class: 'skills' },
    profile.skills.map((id) => h('section', { class: 'skill-group glass', 'data-skill-group': id },
      h('h3', {}, t(`skills.${id}.title`)),
      h('ul', { class: 'chips' }, t(`skills.${id}.items`).map((item) => h('li', { class: 'chip' }, item))))));
}
