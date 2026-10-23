import { h } from '../dom.js';

export function renderCertifications({ t, profile }) {
  return h('ul', { class: 'certifications' },
    profile.certifications.map((cert) => h('li', { class: 'certification', 'data-status': cert.status },
      h('span', {}, t(`certifications.${cert.id}`)),
      cert.status === 'inProgress' ? h('span', { class: 'badge' }, t('ui.certifications.inProgress')) : null)));
}
