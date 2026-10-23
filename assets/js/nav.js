// Header navigation: mobile menu toggle, active section highlight, deep links (AC-03/04/05).

const DESKTOP_QUERY = '(min-width: 960px)';
let sectionObserver;

export function initMenu({ nav, toggle }) {
  toggle.hidden = false;
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia(DESKTOP_QUERY).addEventListener?.('change', () => setOpen(false));
}

export function setMenuLabels(toggle, t) {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.querySelector('.menu-toggle__label').textContent = open ? t('ui.menu.close') : t('ui.menu.open');
  toggle.setAttribute('aria-label', t('ui.menu.open'));
}

/** Marks the nav link of the section currently in view. */
export function trackActiveSection(main, nav) {
  sectionObserver?.disconnect();
  if (!('IntersectionObserver' in window)) return;
  const links = new Map([...nav.querySelectorAll('[data-section]')].map((link) => [link.dataset.section, link]));
  sectionObserver = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      links.forEach((link, id) => link.setAttribute('aria-current', String(id === entry.target.id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  main.querySelectorAll(':scope > section').forEach((section) => sectionObserver.observe(section));
}

/** Scrolls to the element named in the address hash once the content exists (AC-04). */
export function scrollToHash(hashId) {
  if (!hashId) return false;
  const target = document.getElementById(hashId);
  if (!target) return false;
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
  return true;
}
