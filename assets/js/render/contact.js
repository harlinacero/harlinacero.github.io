import { h, externalLink, svgIcon } from '../dom.js';
import { resolveCvDownload } from '../cv.js';

export function renderContact({ t, lang, profile }) {
  const cv = resolveCvDownload(lang, profile.cv);
  const newTabLabel = t('ui.actions.opensInNewTab');

  return h('div', { class: 'contact glass' },
    h('div', { class: 'contact__email' },
      h('a', { class: 'contact__address', href: `mailto:${profile.email}`, 'data-action': 'email', 'aria-label': `${t('ui.actions.sendEmail')}: ${profile.email}` },
        svgIcon('mail'), h('span', { 'data-email': '' }, profile.email)),
      h('button', { type: 'button', class: 'button button--ghost button--small', 'data-action': 'copy-email', 'data-value': profile.email },
        svgIcon('copy'), t('ui.actions.copyEmail')),
      h('p', { class: 'contact__status', 'data-copy-status': '', 'aria-live': 'polite', role: 'status' })),
    h('div', { class: 'contact__links' },
      externalLink(profile.links.linkedin, [svgIcon('linkedin'), 'LinkedIn'],
        { class: 'button button--primary', 'data-action': 'linkedin', newTabLabel }),
      externalLink(profile.links.github, [svgIcon('github'), 'GitHub'],
        { class: 'button button--ghost', 'data-action': 'github', newTabLabel }),
      h('a', { class: 'button button--ghost', href: cv.href, download: true, 'data-action': 'download-cv' },
        svgIcon('download'), t(cv.labelKey))));
}
