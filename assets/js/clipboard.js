// "Copy email" (UC-04 E1, AC-26): Clipboard API, legacy fallback, and finally select the
// visible address so the visitor can copy it by hand.

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or insecure context: try the legacy path.
    }
  }
  const field = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  field.remove();
  return copied;
}

function selectAddress(container) {
  const address = container.querySelector('[data-email]');
  if (!address) return;
  const range = document.createRange();
  range.selectNodeContents(address);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export function initClipboard(root, getT) {
  root.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action="copy-email"]');
    if (!button) return;
    const container = button.closest('.contact');
    const status = container.querySelector('[data-copy-status]');
    const t = getT();
    if (await copyText(button.dataset.value)) {
      status.textContent = t('ui.actions.emailCopied');
    } else {
      selectAddress(container);
      status.textContent = t('ui.actions.copyFailed');
    }
  });
}
