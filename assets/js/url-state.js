// Reads and writes the state carried in the page address: ?lang= and #section.

export function readUrlLang(location) {
  return new URLSearchParams(location.search).get('lang');
}

export function readHashSection(location) {
  const id = decodeURIComponent(location.hash.replace(/^#/, ''));
  return id === '' ? null : id;
}

export function buildUrlWithLang(location, lang) {
  const params = new URLSearchParams(location.search);
  params.set('lang', lang);
  return `${location.pathname}?${params.toString()}${location.hash}`;
}

export function writeUrlLang(lang, location = window.location, history = window.history) {
  history.replaceState(history.state, '', buildUrlWithLang(location, lang));
}
