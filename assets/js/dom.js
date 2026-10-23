// Tiny element builder. Content is always set as text (never innerHTML), so data from the
// content files can never inject markup or scripts.

function append(parent, child) {
  if (child === null || child === undefined || child === false) return;
  if (Array.isArray(child)) {
    child.forEach((item) => append(parent, item));
    return;
  }
  parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
}

export function h(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === null || value === undefined || value === false) return;
    if (/^on[A-Z]/.test(name) && typeof value === 'function') {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(name, value === true ? '' : String(value));
    }
  });
  append(element, children);
  return element;
}

export function svgIcon(name, className = 'icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `assets/icons.svg#${name}`);
  svg.append(use);
  return svg;
}

/** Link that opens in a new tab, safely, and tells screen-reader users that it does. */
export function externalLink(href, content, { newTabLabel, ...attrs } = {}) {
  return h('a', { ...attrs, href, target: '_blank', rel: 'noopener noreferrer' },
    content,
    newTabLabel ? h('span', { class: 'visually-hidden' }, ` ${newTabLabel}`) : null);
}
