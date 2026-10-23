// Keeps the visitor's place when the language changes (BR-04, AC-10, AC-36): remember which
// section is at the top of the viewport and how far into it, re-render, and restore.

function headerOffset() {
  return document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
}

export function capturePosition(main) {
  const top = headerOffset();
  const sections = [...main.querySelectorAll(':scope > section')];
  const current = sections.find((section) => section.getBoundingClientRect().bottom > top + 1) ?? sections[0];
  const caseStudies = main.querySelector('.case-studies');
  return {
    sectionId: current?.id,
    offset: current ? top - current.getBoundingClientRect().top : 0,
    activeCaseStudy: caseStudies?.dataset.active,
    focusedSelector: focusedSelector(),
  };
}

function focusedSelector() {
  const active = document.activeElement;
  if (active?.id) return `#${CSS.escape(active.id)}`;
  return null;
}

export function restorePosition(position) {
  const section = position.sectionId && document.getElementById(position.sectionId);
  if (section) {
    const y = window.scrollY + section.getBoundingClientRect().top - headerOffset() + position.offset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
  }
  if (position.focusedSelector) document.querySelector(position.focusedSelector)?.focus({ preventScroll: true });
}
