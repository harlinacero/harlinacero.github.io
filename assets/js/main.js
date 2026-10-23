// Bootstrap: resolve the language, load the content, render the page and wire the UI.
import { createTranslator, otherLanguage, resolveLanguage } from './i18n.js';
import { readPreference, writePreference } from './storage.js';
import { readHashSection, readUrlLang, writeUrlLang } from './url-state.js';
import { ContentLoadError, loadContent } from './content-loader.js';
import { renderNav, renderPage } from './render/index.js';
import { selectCaseStudy } from './render/case-studies.js';
import { FALLBACK_LINKS, FALLBACK_MESSAGES } from './fallback-messages.js';
import { initMenu, scrollToHash, setMenuLabels, trackActiveSection } from './nav.js';
import { initEffects } from './effects.js';
import { initClipboard } from './clipboard.js';
import { capturePosition, restorePosition } from './language-switch.js';
import { h } from './dom.js';

const STORAGE_KEY = 'hac.lang';
const html = document.documentElement;
const main = document.getElementById('main');
const nav = document.getElementById('site-nav');
const langToggle = document.getElementById('lang-toggle');
const menuToggle = document.getElementById('menu-toggle');
const contentCache = new Map();
const state = { lang: 'en', t: null, ctx: null };

html.classList.replace('no-js', 'js');

function applyChrome(ctx) {
  const { t, lang } = ctx;
  html.lang = lang;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());

  nav.setAttribute('aria-label', t('ui.nav.label'));
  nav.replaceChildren(renderNav(ctx));

  langToggle.hidden = false;
  langToggle.lang = otherLanguage(lang);
  // The accessible name starts with the visible text (WCAG 2.5.3 label in name).
  langToggle.setAttribute('aria-label', `${t('ui.language.switchTo')} · ${t('ui.language.switchToLabel')}`);
  langToggle.querySelector('.lang-toggle__label').textContent = t('ui.language.switchTo');
  setMenuLabels(menuToggle, t);
}

async function render(lang, { activeCaseStudy, firstRender = false } = {}) {
  const content = await loadContent(lang, (file) => fetch(file), contentCache);
  const t = createTranslator(content.dict, content.fallbackDict);
  const ctx = { lang, t, profile: content.profile, projects: content.projects, caseStudies: content.caseStudies };
  Object.assign(state, { lang, t, ctx });

  applyChrome(ctx);
  renderPage(main, ctx, { activeCaseStudy });
  main.removeAttribute('aria-busy');
  initEffects(main, { immediate: !firstRender });
  trackActiveSection(main, nav);
}

function showLoadError(lang, error) {
  console.error(error);
  const messages = FALLBACK_MESSAGES[lang] ?? FALLBACK_MESSAGES.en;
  html.lang = lang;
  main.removeAttribute('aria-busy');
  main.replaceChildren();
  const box = document.getElementById('load-error');
  box.replaceChildren(
    h('h1', {}, messages.title),
    h('p', {}, messages.text),
    h('ul', {},
      h('li', {}, h('a', { href: FALLBACK_LINKS.linkedin, rel: 'noopener noreferrer' }, messages.linkedin)),
      h('li', {}, h('a', { href: FALLBACK_LINKS.cv[lang] ?? FALLBACK_LINKS.cv.es, download: true }, messages.cv))));
  box.hidden = false;
}

async function switchLanguage() {
  const position = capturePosition(main);
  const next = otherLanguage(state.lang);
  try {
    await render(next, { activeCaseStudy: position.activeCaseStudy });
  } catch (error) {
    console.error(error);
    return;
  }
  restorePosition(position);
  writePreference(STORAGE_KEY, next);
  writeUrlLang(next);
}

function openCaseStudy(id, { scroll = true } = {}) {
  const container = main.querySelector('.case-studies');
  const panel = document.getElementById(`case-${id}`);
  if (!container || !panel) return;
  selectCaseStudy(container, id);
  if (scroll) panel.scrollIntoView({ block: 'start' });
  panel.focus({ preventScroll: true });
}

function bindEvents() {
  langToggle.addEventListener('click', switchLanguage);
  initMenu({ nav, toggle: menuToggle });
  initClipboard(main, () => state.t);

  main.addEventListener('click', (event) => {
    const link = event.target.closest('[data-action="architecture"]');
    if (!link) return;
    event.preventDefault();
    history.replaceState(history.state, '', `${location.pathname}${location.search}#case-${link.dataset.caseStudy}`);
    openCaseStudy(link.dataset.caseStudy);
  });
}

function handleInitialHash() {
  const hashId = readHashSection(window.location);
  if (hashId?.startsWith('case-')) {
    openCaseStudy(hashId.slice('case-'.length));
    return;
  }
  scrollToHash(hashId);
}

async function start() {
  const lang = resolveLanguage({
    urlLang: readUrlLang(window.location),
    storedLang: readPreference(STORAGE_KEY),
    browserLangs: navigator.languages?.length ? navigator.languages : [navigator.language],
  });
  try {
    await render(lang, { firstRender: true });
  } catch (error) {
    if (error instanceof ContentLoadError) {
      showLoadError(lang, error);
      return;
    }
    throw error;
  }
  bindEvents();
  handleInitialHash();
}

start();
