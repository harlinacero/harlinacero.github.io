// Localized date ranges for the CV: "Apr 2025 – Sep 2026" / "abr 2025 – sep 2026".
// Month abbreviations are fixed here (not Intl) so every browser shows exactly the same text.

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
};

function formatPoint(value, lang) {
  if (typeof value === 'number') return String(value);
  const [year, month] = value.split('-').map(Number);
  return `${(MONTHS[lang] ?? MONTHS.en)[month - 1]} ${year}`;
}

export function formatPeriod(start, end, lang) {
  return [start, end]
    .filter((point) => point !== undefined && point !== null)
    .map((point) => formatPoint(point, lang))
    .join(' – ');
}
