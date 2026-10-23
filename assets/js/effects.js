// Decorative effects: hero typing, scroll reveal, diagram highlighting.
// All motion is skipped when the visitor asks for reduced motion (AC-06).

export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

let typingTimer;
let revealObserver;

function startTyping(root) {
  clearTimeout(typingTimer);
  const target = root.querySelector('[data-typing]');
  if (!target || prefersReducedMotion()) return;

  const lines = JSON.parse(target.dataset.typing);
  const DELAYS = { hold: 2400, deleting: 28, typing: 60 };
  let lineIndex = 0;
  let length = lines[0].length;
  let phase = 'hold';

  const tick = () => {
    if (phase === 'hold') {
      phase = 'deleting';
    } else if (phase === 'deleting') {
      length -= 1;
      if (length === 0) {
        lineIndex = (lineIndex + 1) % lines.length;
        phase = 'typing';
      }
    } else {
      length += 1;
      if (length === lines[lineIndex].length) phase = 'hold';
    }
    target.textContent = lines[lineIndex].slice(0, length);
    typingTimer = setTimeout(tick, DELAYS[phase]);
  };
  typingTimer = setTimeout(tick, DELAYS.hold);
}

function startReveal(root, { immediate }) {
  const elements = root.querySelectorAll('.reveal');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    document.documentElement.classList.remove('reveal-ready');
    return;
  }
  revealObserver?.disconnect();
  if (immediate) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  document.documentElement.classList.add('reveal-ready');
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  elements.forEach((element) => revealObserver.observe(element));
}

function bindDiagramHighlight(root) {
  const toggle = (flow, on) => {
    const diagram = flow.closest('.diagram');
    flow.classList.toggle('is-highlighted', on);
    flow.dataset.nodes.split(' ').forEach((id) => {
      diagram.querySelector(`[data-node="${CSS.escape(id)}"]`)?.classList.toggle('is-highlighted', on);
    });
  };
  root.querySelectorAll('.diagram__flow').forEach((flow) => {
    flow.addEventListener('mouseenter', () => toggle(flow, true));
    flow.addEventListener('mouseleave', () => toggle(flow, false));
  });
}

/** @param {{ immediate?: boolean }} options immediate: reveal everything at once (re-render). */
export function initEffects(root, { immediate = false } = {}) {
  startTyping(root);
  startReveal(root, { immediate });
  bindDiagramHighlight(root);
}
