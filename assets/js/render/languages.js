import { h } from '../dom.js';

export function renderLanguages({ t, profile }) {
  return h('dl', { class: 'languages' },
    profile.languages.map((id) => [
      h('dt', {}, t(`languages.${id}.name`)),
      h('dd', {}, t(`languages.${id}.level`)),
    ]));
}
