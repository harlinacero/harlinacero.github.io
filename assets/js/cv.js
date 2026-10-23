// Which CV PDF to offer: the current language, else the Spanish one, labeled as such.

export function resolveCvDownload(lang, cv) {
  if (cv[lang]) return { href: cv[lang], labelKey: 'ui.actions.downloadCv', isFallback: false };
  return { href: cv.es, labelKey: 'ui.actions.downloadCvFallback', isFallback: true };
}
