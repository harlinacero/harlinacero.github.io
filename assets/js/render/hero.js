import { h, svgIcon } from '../dom.js';
import { resolveCvDownload } from '../cv.js';

export function renderHero({ t, lang, profile }) {
  const typingLines = t('profile.typing');
  const cv = resolveCvDownload(lang, profile.cv);

  return h('div', { class: 'hero' },
    h('div', { class: 'hero__text' },
      h('p', { class: 'hero__terminal', 'aria-hidden': 'true' },
        h('span', { class: 'hero__prompt' }, '$ harlin --'),
        h('span', { class: 'hero__typing', 'data-typing': JSON.stringify(typingLines) }, typingLines[0]),
        h('span', { class: 'hero__caret' })),
      h('h1', { class: 'hero__name' }, profile.name),
      h('p', { class: 'hero__headline gradient-text' }, t('profile.headline')),
      h('p', { class: 'hero__tagline' }, t('profile.tagline')),
      h('p', { class: 'hero__pitch' }, t('profile.pitch')),
      h('p', { class: 'hero__location' }, svgIcon('pin'), t('profile.location')),
      h('div', { class: 'hero__actions' },
        h('a', { class: 'button button--primary', href: '#projects' }, t('ui.actions.seeProjects')),
        h('a', { class: 'button button--ghost', href: '#contact' }, t('ui.actions.contactMe')),
        h('a', { class: 'button button--ghost', href: cv.href, download: true }, svgIcon('download'), t(cv.labelKey)))),
    h('div', { class: 'hero__visual' },
      h('div', { class: 'hero__photo-ring' },
        h('img', {
          class: 'hero__photo', src: profile.photo, alt: t('profile.photoAlt'), width: 375, height: 375, fetchpriority: 'high',
        }))));
}
