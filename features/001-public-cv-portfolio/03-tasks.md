# [001] Public CV & Portfolio — Tasks (TDD)

> Status: Approved (2026-10-23)
> Based on: `02-technical-spec.md` (Approved 2026-10-23)

Legend: `[TEST]` write a failing test (red) · `[IMPL]` make it pass (green) · `[REFACTOR]` · `[SETUP]` config/infra/docs

## Group 0 — Project setup
- [x] **T-01** `[SETUP]` `package.json` (`type: module`, scripts `test`, `test:e2e`, `check:links`, `serve`, `build`), devDependencies `vitest`, `jsdom`, `@playwright/test`, `@axe-core/playwright`, `unpdf`; `npm install`; `.gitignore`; `.nojekyll`
- [x] **T-02** `[SETUP]` `vitest.config.js` (jsdom, `tests/unit/**`), `playwright.config.js` (chromium desktop + "Pixel 7" mobile project, `webServer: npm run serve`), `npx playwright install chromium`
- [x] **T-03** `[SETUP]` `scripts/serve.mjs` static server (`node:http`, correct MIME types, port from `PORT`, default 4173)

## Group 1 — Language resolution & translation (AC-11, AC-12, AC-13, AC-14, AC-15, AC-17, AC-10)
- [x] **T-04** `[TEST]` `tests/unit/i18n.test.js` →
  - `should resolve spanish when browser prefers es-CO and nothing is stored` → `'es'` (AC-11)
  - `should resolve english when browser prefers fr-FR and nothing is stored` → `'en'` (AC-12)
  - `should resolve the stored language when browser prefers another one` → stored `'es'`, browser `en-US` → `'es'` (AC-13)
  - `should resolve the url language when a different language is stored` → url `'en'`, stored `'es'` → `'en'` (AC-14)
  - `should ignore an unsupported url language when resolving` → url `'fr'`, browser `es` → `'es'` (AC-17)
  - `should return the fallback text when a key is missing in the current language` → `t('ui.only')` returns EN text, never the path (AC-15)
  - `should offer the other language when asked for the toggle target` → `otherLanguage('en') === 'es'` (AC-10)
- [x] **T-05** `[IMPL]` `assets/js/i18n.js` — `SUPPORTED_LANGUAGES`, `resolveLanguage`, `createTranslator`, `otherLanguage`

## Group 2 — Preference storage (AC-16, AC-13)
- [x] **T-06** `[TEST]` `tests/unit/storage.test.js` →
  - `should return the stored value when storage works` (AC-13)
  - `should return null and not throw when storage access throws` (AC-16)
  - `should return false and not throw when writing to storage throws` (AC-16)
- [x] **T-07** `[IMPL]` `assets/js/storage.js` — `readPreference`, `writePreference`
- [x] **T-08** `[TEST]` `tests/unit/url-state.test.js` → `should read the lang query parameter when present`, `should return null when lang is absent`, `should read the section id from the hash` (AC-14, AC-04)
- [x] **T-09** `[IMPL]` `assets/js/url-state.js`

## Group 3 — Content parity (AC-29)
- [x] **T-10** `[TEST]` `tests/unit/i18n.test.js` → `should list the dotted path when a key exists in only one dictionary` → `findMissingKeys({a:{b:1}},{a:{}})` = `['a.b']` (AC-29)
- [x] **T-11** `[IMPL]` `findMissingKeys` in `assets/js/i18n.js`
- [x] **T-12** `[TEST]` `tests/unit/content-parity.test.js` → `should have identical keys when comparing en.json and es.json` (fails naming missing paths), `should have no empty texts in either language`, `should have both languages in fallback-messages` (AC-29, D-03) — red until content exists
- [x] **T-13** `[IMPL]` `content/en.json`, `content/es.json` — full bilingual content per BR-07/13/16/17 (summary, leadership, experience, skills, projects, 3 case studies, education incl. Konrad Lorenz degree project, certifications, languages, UI labels); `assets/js/fallback-messages.js`

## Group 4 — Language-neutral data (AC-02, AC-18, AC-33, AC-41)
- [x] **T-14** `[TEST]` `tests/unit/content-data.test.js` →
  - `should reference only existing text keys when profile, projects and case studies are combined` (every `id`/`labelKey` resolves in both dictionaries)
  - `should list the featured projects in the configured order` → `microservicesDemo, employeeAttendanceControl, eCommerceMajestic, easyReportsIA, medicalcenter` and no excluded repo (AC-18, BR-05)
  - `should define three case studies when loading case-studies.json` with 3–5 decisions each (AC-33, BR-14)
- [x] **T-15** `[IMPL]` `content/profile.json`, `content/projects.json`, `content/case-studies.json`

## Group 5 — Content loading (AC-08)
- [x] **T-16** `[TEST]` `tests/unit/content-loader.test.js` → `should return dictionaries and data when every fetch succeeds`; `should throw ContentLoadError when a fetch fails`; `should throw ContentLoadError when a file is not valid JSON` (AC-08)
- [x] **T-17** `[IMPL]` `assets/js/content-loader.js`

## Group 6 — Element builder & dates
- [x] **T-18** `[TEST]` `tests/unit/dom.test.js` → `should set text without interpreting html when given markup` (security §7); `should add target blank and noopener when building an external link` (AC-19) · `tests/unit/dates.test.js` → `should format the period in english when lang is en` (`Apr 2025 – Sep 2026`), `…in spanish when lang is es` (`abr 2025 – sep 2026`)
- [x] **T-19** `[IMPL]` `assets/js/dom.js`, `assets/js/dates.js`

## Group 7 — Hero, skills, leadership (AC-32, AC-39, AC-01)
- [x] **T-20** `[TEST]` `tests/unit/render/hero.test.js` → `should show photo with alt, name, headline and tagline when rendering in english/spanish` (AC-32, AC-39); `should show projects, contact and download actions` (AC-01); `should not show any availability badge` (AC-39) · `tests/unit/render/skills.test.js` → `should list architecture first when rendering skill groups` (AC-32) · `tests/unit/render/leadership.test.js` → `should render every leadership highlight with metric and text` (BR-07)
- [x] **T-21** `[IMPL]` `assets/js/render/hero.js`, `skills.js`, `leadership.js`, `about.js`

## Group 8 — Experience & education (AC-02, AC-40, AC-41)
- [x] **T-22** `[TEST]` `tests/unit/render/experience.test.js` → `should list companies newest first when rendering the timeline` (Mercado Libre, Siigo, Digitalware, PIV Ingeniería) (AC-02); `should render digitalware as one company with three roles in progression` (AC-02); `should not list konrad lorenz as employer` (AC-02); `should describe 60000 daily productization requests when rendering mercado libre` (AC-40) · `tests/unit/render/education.test.js` → `should show the degree project under the systems engineering degree` (AC-41)
- [x] **T-23** `[IMPL]` `assets/js/render/experience.js`, `education.js`, `certifications.js`, `languages.js`

## Group 9 — Projects (AC-18, AC-19, AC-20, AC-21, AC-22, AC-37)
- [x] **T-24** `[TEST]` `tests/unit/render/projects.test.js` →
  - `should render cards in configured order with description and tags` (AC-18)
  - `should open the repository in a new tab when rendering view code` (`href`, `target=_blank`, `rel`) + `should include a link to the github profile` (AC-19)
  - `should show live demo when the project has a demo url` (AC-20)
  - `should not show live demo when the project has no demo url` (AC-21)
  - `should show both repositories with distinct labels when the project has a companion` (AC-22)
  - `should not show the architecture action when the project has no case study` (AC-37)
- [x] **T-25** `[IMPL]` `assets/js/render/projects.js`

## Group 10 — Case studies & diagrams (AC-33, AC-38)
- [x] **T-26** `[TEST]` `tests/unit/render/diagram.test.js` → `should render every layer and node when given a topology`; `should describe components and interactions in text when asked for the alternative` (AC-38) · `tests/unit/render/case-studies.test.js` → `should show context, diagram, decisions with trade-offs, qualities and view code` (AC-33); `should render one tab per case study` (AC-34)
- [x] **T-27** `[IMPL]` `assets/js/render/diagram.js`, `case-studies.js`

## Group 11 — Contact & CV (AC-23, AC-24, AC-25)
- [x] **T-28** `[TEST]` `tests/unit/cv.test.js` → `should return the current language pdf when it exists` (AC-24); `should return the spanish pdf flagged as fallback when the current language pdf is missing` (AC-25) · `tests/unit/render/contact.test.js` → `should render mailto, linkedin and github links` (AC-23); `should label the download as spanish when falling back` (AC-25)
- [x] **T-29** `[IMPL]` `assets/js/cv.js`, `assets/js/render/contact.js`

## Group 12 — Page composition (AC-01)
- [x] **T-30** `[TEST]` `tests/unit/render/page.test.js` → `should render sections in business order when rendering the page` (hero, leadership, about, architecture, experience, skills, projects, education, certifications, languages, contact) (AC-01)
- [x] **T-31** `[IMPL]` `assets/js/render/index.js`, `index.html` skeleton, `<noscript>` block (AC-09), CSP meta, Open Graph

## Group 13 — Phone never published (AC-23, BR-08)
- [x] **T-32** `[SETUP]` Redact phone from both Owner PDFs with PyMuPDF (scratchpad, not in repo) → `assets/cv/harlin-acero-cv-en.pdf`, `assets/cv/harlin-acero-cv-es.pdf`; copy photo to `assets/img/harlin-acero.jpg`. ⚠ Owner reviews the PDFs
- [x] **T-33** `[TEST]` `tests/unit/no-phone.test.js` → `should not contain the phone number when scanning every publishable text file`; `should not contain the phone number when extracting text from every pdf` (AC-23). Red check: run once against an original (unredacted) PDF copy in a temp dir to prove the detector fires
- [x] **T-34** `[IMPL]` Fix any finding (should already pass after T-32)

## Group 14 — Link check (AC-30)
- [x] **T-35** `[TEST]` `tests/unit/check-links.test.js` → `should fail naming the url when a link answers 404`; `should pass when every link answers 2xx`; `should warn but not fail when linkedin answers 999`; `should fail when a local file path does not exist`; `should retry before failing when the request errors` (AC-30)
- [x] **T-36** `[IMPL]` `scripts/check-links.mjs` (exported `checkLinks` + CLI)

## Group 15 — Styles, wiring & effects
- [x] **T-37** `[IMPL]` `assets/css/tokens.css`, `base.css`, `layout.css`, `components.css`, `effects.css`; self-hosted fonts in `assets/fonts/`; `assets/icons.svg`; `assets/img/og-image.png`
- [x] **T-38** `[IMPL]` `assets/js/main.js`, `nav.js`, `language-switch.js`, `effects.js`, `clipboard.js`

## Group 16 — Browser behavior (E2E, Playwright)
- [x] **T-39** `[TEST]` `tests/e2e/profile.spec.js` → `should show hero and sections in order when opening the site` (AC-01); `should scroll to projects when clicking the menu entry` (AC-03); `should open positioned on the section when the link has a hash` (AC-04)
- [x] **T-40** `[TEST]` `tests/e2e/responsive.spec.js` (mobile project) → `should collapse the menu and have no horizontal scroll on a phone` (AC-05); `should keep the diagram inside its frame without page horizontal scroll` (AC-35)
- [x] **T-41** `[TEST]` `tests/e2e/accessibility.spec.js` → `should show the full headline without animations when reduced motion is requested` (AC-06); `should reach every interactive element by keyboard with visible focus` + `should report no serious or critical axe violations in both languages` (AC-07)
- [x] **T-42** `[TEST]` `tests/e2e/fallbacks.spec.js` → `should show the error message with linkedin and cv links when content fails to load` (route abort `content/**`) (AC-08); `should show name, headline and links when javascript is disabled` (AC-09)
- [x] **T-43** `[TEST]` `tests/e2e/language.spec.js` → `should switch every text and keep the position when toggling language` (no EN-only strings remain; still at `#projects`; button shows "EN") (AC-10); `should open in spanish when the browser locale is es-CO` (AC-11); `should open in the remembered language on return` (AC-13); `should honor lang in the url over the remembered choice` (AC-14); `should switch language without errors when storage throws` (AC-16)
- [x] **T-44** `[TEST]` `tests/e2e/case-studies.spec.js` → `should open the case study from its project card` (AC-33); `should switch between case studies without leaving the page` (AC-34); `should keep the same case study when switching language` (AC-36)
- [x] **T-45** `[TEST]` `tests/e2e/contact.spec.js` → `should copy the email and show a confirmation` (AC-26)
- [x] **T-46** `[IMPL]` Adjust `main.js`/`nav.js`/`language-switch.js`/`effects.js`/CSS until T-39–T-45 pass

## Group 17 — Publishing pipeline (AC-27, AC-28, AC-31)
- [x] **T-47** `[TEST]` `tests/unit/build-site.test.js` → `should copy only publishable files when building the site` (no `features/`, `tests/`, `CLAUDE.md`, `node_modules/`)
- [x] **T-48** `[IMPL]` `scripts/build-site.mjs`
- [x] **T-49** `[TEST]` `tests/unit/workflows.test.js` → `should not deploy when the workflow runs on pull requests` (AC-28); `should deploy only after the quality job succeeds on master` (`needs: quality`, branch `master`) (AC-27, AC-31); `should run unit, e2e, link check and build in the quality workflow` (AC-27)
- [x] **T-50** `[IMPL]` `.github/workflows/quality.yml`, `pr.yml`, `deploy.yml`

## Group 18 — Docs
- [x] **T-51** `[SETUP]` `README.md` (purpose, how to edit content, commands, deploy); `CLAUDE.md` Commands += `check:links`, `build`

## Final verification
- [x] **T-52** Run `npm test`, `npm run test:e2e`, `npm run check:links`, `npm run build`; all green. Visual review with the Owner (screenshots desktop + mobile, EN + ES)
- [ ] **T-53** ⚠ With Owner confirmation: make the repo public, set Pages source to GitHub Actions; push branch, open PR (checks run, AC-28); after merge verify deploy and live URL (AC-27); AC-31 verified by workflow structure (T-49)

## AC coverage
| AC | Test tasks |
|----|------------|
| AC-01 | T-20, T-30, T-39 |
| AC-02 | T-14, T-22 |
| AC-03 | T-39 |
| AC-04 | T-08, T-39 |
| AC-05 | T-40 |
| AC-06 | T-41 |
| AC-07 | T-41 |
| AC-08 | T-16, T-42 |
| AC-09 | T-42 |
| AC-10 | T-04, T-43 |
| AC-11 | T-04, T-43 |
| AC-12 | T-04 |
| AC-13 | T-04, T-06, T-43 |
| AC-14 | T-04, T-08, T-43 |
| AC-15 | T-04 |
| AC-16 | T-06, T-43 |
| AC-17 | T-04 |
| AC-18 | T-14, T-24 |
| AC-19 | T-18, T-24 |
| AC-20 | T-24 |
| AC-21 | T-24 |
| AC-22 | T-24 |
| AC-23 | T-28, T-33 |
| AC-24 | T-28 |
| AC-25 | T-28 |
| AC-26 | T-45 |
| AC-27 | T-49 (+ T-53 live) |
| AC-28 | T-49 (+ T-53 PR) |
| AC-29 | T-10, T-12 |
| AC-30 | T-35 |
| AC-31 | T-49 |
| AC-32 | T-20 |
| AC-33 | T-14, T-26, T-44 |
| AC-34 | T-26, T-44 |
| AC-35 | T-40 |
| AC-36 | T-44 |
| AC-37 | T-24 |
| AC-38 | T-26 |
| AC-39 | T-20 |
| AC-40 | T-22 |
| AC-41 | T-22 |

## Implementation notes
(Deviations from the plan discovered while implementing.)
- T-12/T-14: tests read JSON with `resolve(process.cwd(), …)`; `new URL(template, import.meta.url)` is rewritten by Vite and broke the path.
- T-14: added `ui.caseStudy.ownedBy` to both dictionaries (data stores declare `ownedBy` in `case-studies.json` for the diagram text alternative).
- T-28 (`cv.js`) was implemented before T-20, because the hero's Download CV action uses it.
- T-19: `dates.js` uses fixed month abbreviations instead of `Intl.DateTimeFormat` (ICU returned `sept` in Spanish and differs across browsers); tech spec updated.
- T-31: the skip-link text and nav `aria-label` start in English in `index.html` and are replaced from the dictionaries at load (`data-i18n`); added `ui.nav.label`.
- T-32: redaction rewrites the contact line with the Calibri font embedded in the Spanish PDF (the English PDF's font subsets have no character map), so no gap is left; both headers checked visually.
- T-37: fonts self-hosted are Space Grotesk, Inter and JetBrains Mono (OFL, `assets/fonts/LICENSE.txt`); added `assets/img/favicon.svg`; `og-image.png` rendered with Playwright.
- T-41: axe found two real issues, both fixed: the brand link's `aria-label` and the language button's accessible name didn't contain their visible text (WCAG 2.5.3). The keyboard test ignores focus leaving the page.
- T-50: the quality job builds `_site/` and uploads it as an artifact; the deploy job downloads it, so the published files are exactly the ones that passed the checks.
