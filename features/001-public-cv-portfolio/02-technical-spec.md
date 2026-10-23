# [001] Public CV & Portfolio — Technical Specification

> Status: Approved (2026-10-23)
> Based on: `01-business-spec.md` (Approved 2026-10-23)
> Reference implementation followed: none — first feature of a greenfield repo; follows `CLAUDE.md` › SDD Conventions

## 1. Overview
A static, dependency-free single page (`index.html`) rendered client-side from JSON content files. Pure ES modules build the DOM from data (testable with Vitest + jsdom); a thin `main.js` wires events, effects and language switching. All texts live in `content/en.json` / `content/es.json`; language-neutral data (URLs, dates, tags, order, diagram topology) lives in `content/profile.json`, `content/projects.json` and `content/case-studies.json`. A GitHub Actions workflow runs the quality check (unit + E2E + accessibility + content parity + link check + no-phone scan) on every PR and push, and deploys to GitHub Pages only from `master` when all checks pass.

## 2. Components by layer

### Page shell
- (+) `index.html` — semantic skeleton: `<header>` (nav + language button + mobile menu toggle), `<main>` with empty `<section>` containers in business order: `#hero`, `#leadership`, `#about`, `#architecture`, `#experience`, `#skills`, `#projects`, `#education`, `#certifications`, `#languages`, `#contact`; `<footer>`. Static `<head>`: title, meta description, Open Graph tags (EN), CSP meta, preload of fonts. `<noscript>` fallback (AC-09). `<div id="load-error" hidden>` slot (AC-08).
- (+) `.nojekyll` — serve files as-is.

### Logic modules (`assets/js/`, pure, unit-tested)
- (+) `i18n.js`
  - `SUPPORTED_LANGUAGES = ['en','es']`, `DEFAULT_LANGUAGE = 'en'`
  - `resolveLanguage({ urlLang, storedLang, browserLangs })` → `'en'|'es'`. Priority: valid `urlLang` › valid `storedLang` › first `browserLangs` entry whose primary subtag is `es` → `'es'` › `'en'` (BR-02, BR-03; AC-11/12/13/14/17)
  - `createTranslator(dict, fallbackDict)` → `t(path)` reading dotted paths (`ui.nav.projects`), falling back to the other language, never returning the key itself (AC-15)
  - `otherLanguage(lang)` → label for the toggle (AC-10)
  - `findMissingKeys(a, b)` → list of dotted paths present in one dictionary and not the other (used by the parity test, AC-29)
- (+) `storage.js` — `readPreference(key)` / `writePreference(key, value)` wrapping `localStorage` in `try/catch`, returning `null`/`false` on failure (AC-16)
- (+) `url-state.js` — `readUrlLang(location)` (`?lang=`), `writeUrlLang(lang)` via `history.replaceState` (shareable links), `readHashSection(location)`
- (+) `content-loader.js` — `loadContent(lang, fetchFn = fetch)` → `{ dict, fallbackDict, profile, projects, caseStudies }`; throws `ContentLoadError` on any failed/invalid fetch (AC-08)
- (+) `cv.js` — `resolveCvDownload(lang, profile.cv)` → `{ href, labelKey, isFallback }`; uses `cv[lang]`, else `cv.es` with `isFallback = true` (BR-09; AC-24/25)
- (+) `dates.js` — `formatPeriod(start, end, lang)` with fixed month abbreviations per language (`Apr 2025 – Sep 2026` / `abr 2025 – sep 2026`); not `Intl`, because ICU output differs between browsers (e.g. `sept`)
- (+) `dom.js` — `h(tag, attrs, ...children)` element builder that sets text via `textContent` (no `innerHTML` with content data); `externalLink(href, text)` adds `target="_blank" rel="noopener noreferrer"`

### Renderers (`assets/js/render/`, pure: `(data, t, lang) → HTMLElement`, unit-tested)
- (+) `hero.js` — photo (`alt` from `t`), name, headline, tagline, location, typing target, quick actions (Projects, Contact, Download CV). No availability badge (AC-32, AC-39)
- (+) `leadership.js` — highlight cards (metric + text), e.g. "6+ developers led", "10+ micro-apps documented", "60,000 requests/day" (BR-07)
- (+) `about.js` — summary paragraphs
- (+) `case-studies.js` — tab list + panels per case study: context, diagram, decisions (decision / trade-off), quality-attribute chips, "View code"; diagram text alternative generated from the same data (AC-33/34/38)
- (+) `diagram.js` — renders a case-study topology as a layered HTML/CSS diagram: rows (`client`, `edge`, `services`, `messaging`, `data`, `platform`) of nodes `{ id, labelKey, tech }` plus an ordered list of interactions `{ from, to, kind: sync|async|config|telemetry, labelKey }` drawn as connector annotations; inside a horizontally pannable frame on narrow screens (AC-35). `describeDiagram(topology, t)` returns the text alternative (AC-38)
- (+) `experience.js` — timeline from `profile.experience` (companies, roles with dates) + texts; Digitalware rendered as one company with three roles as a progression (AC-02, AC-40, BR-17)
- (+) `skills.js` — groups in architecture-first order from `profile.skills` (AC-32)
- (+) `projects.js` — cards from `projects.json` in configured order: name, description, "demonstrates" line, tags, "View code" (+ companion repos), "Live demo" only if `demoUrl`, "Architecture" only if `caseStudyId`, plus GitHub profile link (AC-18–22, AC-37)
- (+) `education.js` — degrees, incl. Konrad Lorenz degree project (AC-41); `certifications.js`; `languages.js`
- (+) `contact.js` — email (`mailto:`), copy-email button, LinkedIn, GitHub, Download CV (AC-23/24/25/26)
- (+) `render/index.js` — `renderPage(root, model)` calls every section renderer in business order

### UI wiring & effects (`assets/js/`, covered by E2E)
- (+) `main.js` — bootstrap: resolve language → `loadContent` → `renderPage` → `bindUi`; on `ContentLoadError` shows the built-in error message (AC-08); sets `<html lang>` and `document.title`
- (+) `language-switch.js` — on click: remember the section in view (`IntersectionObserver` anchor + offset), load other dictionary (cached), re-render texts, restore scroll, `writePreference`, `writeUrlLang`, keep the active case-study tab (AC-10, AC-36)
- (+) `nav.js` — smooth-scroll menu, active-section highlight, mobile toggle (`aria-expanded`), deep link on load (AC-03/04/05)
- (+) `effects.js` — hero typing effect, scroll-reveal, animated flow pulses on diagram connectors; all disabled when `matchMedia('(prefers-reduced-motion: reduce)')` (AC-06)
- (+) `clipboard.js` — `navigator.clipboard.writeText` + live-region confirmation (`aria-live="polite"`), fallback `execCommand('copy')` (AC-26)
- (+) `fallback-messages.js` — the only hard-coded strings: the load-error message in EN/ES (needed precisely when content can't load). See D-03

### Styles (`assets/css/`)
- (+) `tokens.css` — dark palette, neon accents (cyan/violet/magenta gradients), spacing, radii, typography scale
- (+) `base.css` (reset, typography, focus-visible ring), `layout.css` (mobile-first grid, header, sections), `components.css` (cards, glass panels, buttons, chips, tabs, timeline, diagram), `effects.css` (gradients, glow, reveal, typing caret, flow pulses; wrapped in `@media (prefers-reduced-motion: no-preference)`)

### Assets
- (+) `assets/img/harlin-acero.jpg` — LinkedIn photo 375×375 (already downloaded)
- (+) `assets/img/og-image.png` — 1200×630 social preview (name + headline)
- (+) `assets/fonts/` — self-hosted woff2: *Space Grotesk* (headings), *Inter* (body) and *JetBrains Mono* (terminal/tech accents), all SIL OFL (D-05)
- (+) `assets/cv/harlin-acero-cv-en.pdf`, `assets/cv/harlin-acero-cv-es.pdf` — Owner's PDFs with the phone number **redacted** (text removed, not covered) using a one-off PyMuPDF script run outside the repo; Owner reviews before merge (BR-08)
- (+) `assets/icons.svg` — SVG sprite (GitHub, LinkedIn, mail, download, external, copy, language)

### Content (`content/`)
- (+) `en.json`, `es.json` — identical key trees:
  ```json
  {
    "meta": { "title": "…", "description": "…" },
    "ui": { "nav": {…}, "actions": { "viewCode": "View code", "liveDemo": "Live demo", "architecture": "Architecture", "downloadCv": "Download CV", "downloadCvFallback": "Download CV (Spanish)", "copyEmail": "Copy email", "emailCopied": "Email copied" }, "language": { "switchTo": "ES", "switchToLabel": "Ver en español" }, "sections": {…} },
    "profile": { "headline": "Software Engineer & Software Architect", "tagline": "10+ years · Tech Lead · Microservices · Cloud (Azure)", "location": "…", "photoAlt": "…", "summary": ["…"], "typing": ["…"] },
    "leadership": { "items": { "team": {"metric":"6+","text":"…"}, … } },
    "experience": { "mercadolibre": { "team": "…", "roles": { "senior": { "title": "…", "achievements": ["…"] } } }, … },
    "skills": { "architecture": "Architecture", … },
    "projects": { "microservicesDemo": { "description": "…", "demonstrates": "…" }, … },
    "caseStudies": { "microservicesDemo": { "title": "…", "context": "…", "nodes": {…}, "interactions": {…}, "decisions": { "d1": { "decision": "…", "tradeOff": "…" } }, "qualities": {…} }, … },
    "education": {…}, "certifications": {…}, "languages": {…}
  }
  ```
- (+) `profile.json` — `name`, `email`, `links { linkedin, github }`, `photo`, `cv { en, es }`, `experience[] { id, company, location, roles[] { id, start, end } }`, `skills[] { groupId, items[] }` (technology names are not translated), `education[] { id, institution, start, end, projectKey? }`, `certifications[] { id, status: done|inProgress }`
- (+) `projects.json` — ordered `[{ id, repo, companions: [{ repo, labelKey }], demoUrl: null, tags: [], caseStudyId: null }]`
- (+) `case-studies.json` — `[{ id, projectId, repo, layers: [{ id, nodes: [{ id, tech }] }], interactions: [{ from, to, kind }], decisions: ["d1",…], qualities: ["scalability",…] }]`

### Tooling (`scripts/`, Node built-ins only)
- (+) `scripts/serve.mjs` — tiny static server (`node:http`) used by `npm run serve` and Playwright `webServer`
- (+) `scripts/check-links.mjs` — collects every URL/path from `content/*.json` + `index.html`; local paths must exist; external URLs checked with `fetch` (HEAD, GET fallback, 2 retries). LinkedIn answers bots with status `999` → treated as "reachable, unverifiable" (warning, not failure). Exits 1 naming each broken link (AC-30). Core logic `checkLinks(urls, fetchFn, fsExists)` exported for unit tests
- (+) `scripts/build-site.mjs` — copies only publishable files (`index.html`, `.nojekyll`, `assets/`, `content/`) to `_site/` (features, tests, CLAUDE.md are not published)

### CI/CD (`.github/workflows/`)
- (+) `quality.yml` — reusable workflow (`workflow_call`): `npm ci` → `npm test` → `npx playwright install --with-deps chromium` → `npm run test:e2e` → `npm run check:links` → `npm run build`
- (+) `pr.yml` — `on: pull_request` → calls `quality.yml`; no deploy (AC-28)
- (+) `deploy.yml` — `on: push: branches: [master]` + `workflow_dispatch`; job `quality` (calls `quality.yml`) → job `deploy` `needs: quality` downloads the `_site` artifact built by the quality job, then `actions/configure-pages`, `actions/upload-pages-artifact` (`_site`), `actions/deploy-pages`; permissions `pages: write`, `id-token: write`; `concurrency: pages` (AC-27/31). If any step fails, deploy never runs, so the last good version stays online; GitHub emails the Owner on workflow failure (AC-31)

### Project files
- (+) `package.json` — `"type": "module"`, scripts: `test` (vitest run), `test:e2e` (playwright test), `check:links`, `serve`, `build`
- (+) `vitest.config.js` (environment `jsdom`, include `tests/unit/**`), `playwright.config.js` (chromium + mobile viewport project "Pixel 7", `webServer: npm run serve`)
- (+) `README.md` — what the site is, how to edit content, commands, deploy
- (+) `.gitignore` — `node_modules/`, `_site/`, `test-results/`, `playwright-report/`
- (~) `CLAUDE.md` — add `npm run check:links` and `npm run build` to Commands

## 3. API contract
None — no back end. Public "interface" = URL contract:
| URL | Meaning |
|-----|---------|
| `/` | Site, language per BR-02/03 |
| `/?lang=en` · `/?lang=es` | Forced language (AC-14); unsupported values ignored (AC-17) |
| `/#<section-id>` | Deep link to a section (AC-04); combinable: `/?lang=es#projects` |
| `/assets/cv/harlin-acero-cv-{en,es}.pdf` | CV downloads |

## 4. Data model & persistence
- Content: JSON files described in §2. Visitor state: `localStorage['hac.lang']` (`'en'|'es'`) only.
- **Case-study content** (derived from each repo's README and code; final texts go to `en.json`/`es.json` for Owner review):

| Case study | Context | Key decisions → trade-off | Qualities |
|---|---|---|---|
| **Microservices.Demo** (.NET 6, Java 17, Angular 14) | Insurance platform split into Auth, Product, Pricing, Policy, Report | 1. Database per service, polyglot (MongoDB, SQL Server ×2, PostgreSQL/Marten) → autonomy vs. cross-service reads composed by Report API over HTTP · 2. Single entry via Ocelot API Gateway with JWT → central policy enforcement vs. extra hop / critical component · 3. Eureka discovery + Spring Cloud Config with routes/config in a separate Git repo → change config without rebuilding vs. hard startup dependency (`failFast`) · 4. RabbitMQ events from Policy → decoupling vs. eventual consistency · 5. ELK + APM + Jaeger → full observability vs. heavy infrastructure footprint | Scalability, modifiability, observability, security |
| **EmployeeAttendanceControl** (.NET 10) | Employees, users and attendance history | 1. Ocelot gateway enforces JWT + `admin` role, services re-validate tokens → defense in depth vs. duplicated checks · 2. Events `EmployeeCreateEvent` / `AttendanceStateChangedEvent` over durable RabbitMQ queues → loose coupling vs. eventual consistency · 3. Fit-for-purpose storage: Cassandra (users), SQL Server + Dapper (current state), MongoDB append-only history → each store fits its access pattern vs. operational complexity · 4. Clean layers + CQRS (MediatR) per service → testability vs. boilerplate · 5. Central package management + test keeping both gateway route catalogs in sync → consistency vs. stricter workflow | Security, maintainability, testability, consistency |
| **e-commerce-majestic-full** (Go, Angular 16) | E-commerce with roles (admin, seller, shopper), cart and AI chatbot | 1. Modular Go REST API (gorilla/mux + GORM) instead of microservices → simple to build/deploy vs. scaling as one unit · 2. Polyglot: MySQL for transactional data, MongoDB for chat history → right model per data vs. two stores to operate · 3. Role-based JWT middleware declared per route → explicit, auditable access rules vs. repetition · 4. Containers on AWS: ECR + ECS services behind one ALB per tier, RDS MySQL, managed MongoDB → managed scaling vs. cloud cost/complexity · 5. OpenAI chatbot called from the SPA → fast prototype vs. key exposure; *next step: proxy through the API* | Deployability, scalability, security |

- EasyReportsIA (+ easyreports) and medicalcenter: project cards only (no case study). EasyReportsIA: natural-language → SQL reports (schema introspection + `gpt-4o-mini`), React/DevExtreme front end. medicalcenter: medical-appointment app, React + .NET 8, N-layer domain-oriented.

## 5. Inter-service impact
None. External links only: GitHub repos/profile, LinkedIn, `mailto:`.

## 6. Configuration & dependencies
- **New devDependencies — ⚠ need Owner approval:** `vitest`, `jsdom`, `@playwright/test`, `@axe-core/playwright`, `unpdf` (extract PDF text for the no-phone scan). No runtime dependencies; nothing loaded from a CDN.
- One-off local tool (not a project dependency): `pymupdf` (pip) in the scratchpad to redact the phone from the PDFs.
- Node 24 in CI (`actions/setup-node` with npm cache).
- **GitHub settings (outward, Owner confirmation required, done at the end):** make `harlinacero.github.io` public; Pages → Source: *GitHub Actions*. (Pages on a private repo needs a paid plan.)

## 7. Security
- No secrets, no back end, no cookies, no analytics. Content rendered with `textContent` only (no `innerHTML` from data) → no injection even if content is edited carelessly.
- CSP meta: `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'`.
- External links `rel="noopener noreferrer"`.
- PII: phone never published — `tests/unit/no-phone.test.js` scans every publishable file (HTML/JSON/JS/CSS text + extracted PDF text) for the phone digits in any formatting (`/3\D*1\D*2\D*3\D*8\D*7\D*9\D*0\D*4\D*6/`) (BR-08, AC-23). Email is public by Owner decision.

## 8. Error handling & logging
| Failure | Behavior |
|---|---|
| Content JSON fetch/parse fails | `ContentLoadError` → hide skeleton, show `fallback-messages.js` text in resolved language with LinkedIn + CV links (AC-08); `console.error` |
| Missing translation key | `t()` returns other language's text; `console.warn('[i18n] missing key', path)` (AC-15) |
| `localStorage` unavailable | preference not stored, no error shown (AC-16) |
| Clipboard API unavailable/denied | fallback copy; if that fails, select the visible address text and show "press Ctrl+C" hint |
| Scripts disabled | `<noscript>` block (AC-09) |
| Quality check / deploy fails | Deploy job skipped or fails; previous Pages deployment remains live; GitHub failure email (AC-31) |

## 9. Traceability
| AC | Components | Test level |
|----|------------|------------|
| AC-01 | `index.html`, `render/index.js`, `hero.js` | unit (section order) + E2E |
| AC-02, AC-40 | `experience.js`, `profile.json`, `*.json` | unit |
| AC-03 | `nav.js` | E2E |
| AC-04 | `nav.js`, `url-state.js` | E2E |
| AC-05 | `layout.css`, `nav.js` | E2E (mobile project) |
| AC-06 | `effects.js`, `effects.css` | E2E (`reducedMotion: 'reduce'`) |
| AC-07 | `base.css`, all renderers | E2E keyboard + axe |
| AC-08 | `content-loader.js`, `main.js`, `fallback-messages.js` | unit + E2E (route abort) |
| AC-09 | `index.html` `<noscript>` | E2E (`javaScriptEnabled: false`) |
| AC-10 | `language-switch.js`, `i18n.js` | unit (toggle label) + E2E |
| AC-11, AC-12, AC-14, AC-17 | `i18n.resolveLanguage` | unit + E2E (AC-11 `locale`, AC-14 URL) |
| AC-13 | `resolveLanguage`, `storage.js` | unit + E2E |
| AC-15 | `createTranslator` | unit |
| AC-16 | `storage.js` | unit + E2E (throwing `localStorage`) |
| AC-18–22, AC-37 | `projects.js`, `projects.json` | unit |
| AC-23 | `contact.js`, `no-phone.test.js` | unit |
| AC-24, AC-25 | `cv.js`, `contact.js`, `hero.js` | unit |
| AC-26 | `clipboard.js` | E2E (clipboard permissions) |
| AC-27, AC-28, AC-31 | `pr.yml`, `deploy.yml`, `quality.yml` | unit (workflow structure test) + manual verification on first PR/merge |
| AC-29 | `findMissingKeys`, `content-parity.test.js` | unit |
| AC-30 | `scripts/check-links.mjs` | unit (injected fetch) + CI run |
| AC-32, AC-39 | `hero.js`, `skills.js` | unit |
| AC-33, AC-38 | `case-studies.js`, `diagram.js` | unit + E2E |
| AC-34, AC-36 | `case-studies.js`, `language-switch.js` | E2E |
| AC-35 | `diagram.js`, `components.css` | E2E (mobile project) |
| AC-41 | `education.js` | unit |

## 10. Risks, trade-offs & decisions
- **D-01** — Client-side rendering from JSON (vs. hand-written HTML per language or a static-site generator): one source of truth per language, instant switching without reload, pure renderers are unit-testable, zero build. Cost: content invisible without JS and to crawlers that don't run JS → mitigated by `<noscript>` and static EN `<title>`/meta/Open Graph.
- **D-02** — Layered HTML/CSS diagrams generated from data (vs. static SVG images per language or a diagram library like Mermaid): labels come from the dictionaries (switch language for free, AC-36), the text alternative is generated from the same topology (AC-38), responsive, no dependency. Cost: less freedom than a hand-drawn diagram; connectors are annotations between layers, not free-form lines.
- **D-03** — ⚠ Convention exception: two places hold hard-coded text, against "content never hard-coded": `fallback-messages.js` (error shown when the content itself fails to load) and the `<noscript>` block. Both are unavoidable by nature; parity test also checks both languages exist in `fallback-messages.js`. **Needs Owner OK.**
- **D-04** — Own small scripts (`serve.mjs`, `check-links.mjs`, `build-site.mjs`) on Node built-ins instead of extra packages (`http-server`, `lychee`, …): fewer dependencies to approve and maintain.
- **D-05** — Self-hosted fonts instead of Google Fonts: works with a strict CSP, no third-party requests (visitor privacy), no layout shift with `preload` + `font-display: swap`.
- **D-06** — Phone redaction done once, outside the repo, with PyMuPDF true redaction; enforced forever by the no-phone scan. When the Owner replaces a PDF, the scan blocks publishing until it's phone-free.
- **D-07** — Language in `?lang=` (vs. `/es/` paths): single page, no duplicated HTML. Cost: crawlers index only the English meta.
- **R-01** — LinkedIn blocks automated checks (status 999) → reported as warning, not failure.
- **R-02** — External link checks can flake in CI → retries; a real broken repo still fails.
- **R-03** — Repository becomes public: the history includes the old calculator exercise (harmless). Observation outside this feature: several public project READMEs contain demo credentials (e.g. e-commerce `admin/admin1234`, MySQL `harlin/1234`) — visible to recruiters who open them; consider cleaning up separately.
