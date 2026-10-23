# [001] Public CV & Portfolio — Implementation Checklist

> Last reviewed: 2026-10-23
> Overall: ⚠️ In progress. Implementation and tests are complete; publication (T-53) is pending the Owner's confirmation.

## 1. Acceptance criteria
| AC | Flow | Status | Proving test(s) | Implementation |
|----|------|--------|-----------------|----------------|
| AC-01 | UC-01 main | ✅ | `render/hero.test.js` › should show projects, contact and download actions · `render/page.test.js` › should render sections in business order · `e2e/profile.spec.js` › should show hero and sections in order | `render/index.js`, `render/hero.js`, `index.html` |
| AC-02 | UC-01 main | ✅ | `content-data.test.js` › should list the experience newest first… · `render/experience.test.js` (4 tests) | `render/experience.js`, `content/profile.json` |
| AC-03 | UC-01 main | ✅ | `e2e/profile.spec.js` › should scroll to projects when clicking the menu entry | `render/index.js` › `renderNav`, `nav.js` |
| AC-04 | UC-01 A1 | ✅ | `url-state.test.js` › should read the section id from the hash · `e2e/profile.spec.js` › should open positioned on the section… / should open the case study when the link points to it | `url-state.js`, `nav.js` › `scrollToHash`, `main.js` |
| AC-05 | UC-01 A2 | ✅ | `e2e/responsive.spec.js` (mobile) › should collapse the menu and have no horizontal scroll | `layout.css`, `nav.js` › `initMenu` |
| AC-06 | UC-01 A3 | ✅ | `e2e/accessibility.spec.js` › should show the full headline without animations… | `effects.js`, `effects.css` |
| AC-07 | UC-01 A4 | ✅ | `e2e/accessibility.spec.js` › keyboard + axe EN/ES (0 serious/critical) | `base.css` (`:focus-visible`), renderers |
| AC-08 | UC-01 E1 | ✅ | `content-loader.test.js` (4 failure tests) · `e2e/fallbacks.spec.js` › should show the error message… | `content-loader.js`, `main.js` › `showLoadError`, `fallback-messages.js` |
| AC-09 | UC-01 E2 | ✅ | `e2e/fallbacks.spec.js` › should show name, headline and links when javascript is disabled | `index.html` `<noscript>` |
| AC-10 | UC-02 main | ✅ | `i18n.test.js` › should offer the other language… · `e2e/language.spec.js` › should switch every text and keep the position | `main.js` › `switchLanguage`, `language-switch.js` |
| AC-11 | UC-02 A1 | ✅ | `i18n.test.js` › should resolve spanish when browser prefers es-CO… · `e2e/language.spec.js` › should open in spanish when the browser locale is es-CO | `i18n.js` › `resolveLanguage` |
| AC-12 | UC-02 A2 | ✅ | `i18n.test.js` › should resolve english when browser prefers fr-FR… | `i18n.js` |
| AC-13 | UC-02 A3 | ✅ | `i18n.test.js`, `storage.test.js` · `e2e/language.spec.js` › should open in the remembered language on return | `i18n.js`, `storage.js` |
| AC-14 | UC-02 A4 | ✅ | `i18n.test.js` › should resolve the url language… · `e2e/language.spec.js` › should honor lang in the url… | `i18n.js`, `url-state.js` |
| AC-15 | UC-02 E1 | ✅ | `i18n.test.js` › should return the fallback text when a key is missing… | `i18n.js` › `createTranslator` |
| AC-16 | UC-02 E2 | ✅ | `storage.test.js` (2 throwing tests) · `e2e/language.spec.js` › should switch language without errors when storage throws | `storage.js` |
| AC-17 | UC-02 E3 | ✅ | `i18n.test.js` › should ignore an unsupported url language… | `i18n.js` |
| AC-18 | UC-03 main | ✅ | `content-data.test.js` › should list the featured projects… · `render/projects.test.js` › should render cards in configured order… | `render/projects.js`, `content/projects.json` |
| AC-19 | UC-03 main | ✅ | `render/projects.test.js` › should open the repository in a new tab… / should include a link to the github profile · `dom.test.js` › should add target blank and noopener… | `render/projects.js`, `dom.js` |
| AC-20 | UC-03 A1 | ✅ | `render/projects.test.js` › should show live demo when the project has a demo url | `render/projects.js` |
| AC-21 | UC-03 E1 | ✅ | `render/projects.test.js` › should not show live demo when the project has no demo url | `render/projects.js` |
| AC-22 | UC-03 A2 | ✅ | `render/projects.test.js` › should show both repositories with distinct labels… | `render/projects.js` |
| AC-23 | UC-04 main | ✅ | `render/contact.test.js` (links, no phone) · `no-phone.test.js` (pages + PDFs; proven red against the original PDF) · `e2e/contact.spec.js` › …without any phone number | `render/contact.js`, `assets/cv/*.pdf` (redacted) |
| AC-24 | UC-04 step 4 | ✅ | `cv.test.js` › should return the current language pdf… · `render/contact.test.js` › should offer the cv of the current language | `cv.js`, `render/contact.js`, `render/hero.js` |
| AC-25 | UC-04 A1 | ✅ | `cv.test.js` › …spanish pdf flagged as fallback… · `render/contact.test.js` › should label the download as spanish when falling back | `cv.js` |
| AC-26 | UC-04 E1 | ✅ | `e2e/contact.spec.js` › should copy the email and show a confirmation | `clipboard.js` |
| AC-27 | UC-05 main | ⚠️ | `workflows.test.js` › should deploy only after the quality job succeeds on master / should run unit, e2e, link check and build… | `.github/workflows/deploy.yml`, `quality.yml`. Live deploy not verified yet (needs T-53). |
| AC-28 | UC-05 A1 | ⚠️ | `workflows.test.js` › should not deploy when the workflow runs on pull requests | `.github/workflows/pr.yml`. Live PR run not verified yet (needs T-53). |
| AC-29 | UC-05 E1 | ✅ | `i18n.test.js` › findMissingKeys (3) · `content-parity.test.js` (3) | `i18n.js` › `findMissingKeys` |
| AC-30 | UC-05 E2 | ✅ | `check-links.test.js` (8) · real run: 24 links, 0 broken | `scripts/check-links.mjs` |
| AC-31 | UC-05 E3/E4 | ⚠️ | `workflows.test.js` (`needs: quality`, `concurrency: pages`) | `deploy.yml`. Failure behavior can only be observed live (GitHub's own failure email). |
| AC-32 | UC-01 main | ✅ | `render/hero.test.js` (EN/ES headline) · `render/skills.test.js` › should list architecture first… | `render/hero.js`, `render/skills.js` |
| AC-33 | UC-06 main | ✅ | `content-data.test.js` › should define three case studies… · `render/case-studies.test.js` › should show context, diagram, decisions… · `e2e/case-studies.spec.js` › should open the case study from its project card | `render/case-studies.js`, `render/diagram.js`, `main.js` › `openCaseStudy` |
| AC-34 | UC-06 A1 | ✅ | `render/case-studies.test.js` (tabs, click, arrow keys) · `e2e/case-studies.spec.js` › should switch between case studies… | `render/case-studies.js` |
| AC-35 | UC-06 A2 | ✅ | `e2e/responsive.spec.js` (mobile) › should keep the diagram inside its frame… | `components.css` (`.diagram__frame`) |
| AC-36 | UC-06 A3 | ✅ | `e2e/case-studies.spec.js` › should keep the same case study when switching language · `render/diagram.test.js` › should label the diagram in spanish… | `language-switch.js`, `main.js`, `render/diagram.js` |
| AC-37 | UC-06 E1 | ✅ | `render/projects.test.js` › should not show the architecture action when the project has no case study | `render/projects.js` |
| AC-38 | UC-06 E2 | ✅ | `render/diagram.test.js` › should describe components and interactions in text… (2) | `render/diagram.js` › `describeDiagram` |
| AC-39 | UC-01 main | ✅ | `render/hero.test.js` › photo with alt (EN/ES) / should not show any availability badge | `render/hero.js`, `assets/img/harlin-acero.jpg` |
| AC-40 | UC-01 main | ✅ | `render/experience.test.js` › should describe 60000 daily productization requests… | `content/en.json`, `content/es.json` |
| AC-41 | UC-01 main | ✅ | `render/education.test.js` › should show the degree project under the systems engineering degree | `render/education.js` |

Every use-case flow (main, alternative and exception) has at least one passing test. The three ⚠️ items are the publishing pipeline: its structure is tested, but the live behavior can only be observed once the repository is pushed and Pages is enabled.

## 2. Tasks
| Task | Status | Evidence / note |
|------|--------|-----------------|
| T-01 – T-03 | ✅ | `package.json`, configs, `scripts/serve.mjs` (manually checked: 200 / 404 / path traversal → 404 / malformed URL → 403) |
| T-04 – T-09 | ✅ | `i18n`, `storage`, `url-state` tests red (module missing) → green |
| T-10 – T-13 | ✅ | parity tests; full bilingual content approved by the Owner |
| T-14 – T-15 | ✅ | `content-data.test.js` red (files missing) → green |
| T-16 – T-17 | ✅ | `content-loader.test.js` red → green |
| T-18 – T-19 | ✅ | red → 2 real failures (ICU `sept`, hidden-label spacing) → green |
| T-20 – T-27 | ✅ | renderer tests red (module missing) → green |
| T-28 – T-29 | ✅ | `cv.js` done before T-20 (the hero uses it) |
| T-30 – T-31 | ✅ | `page.test.js` red → green; `index.html` with CSP, OG, `<noscript>` |
| T-32 | ✅ | phone redacted from both PDFs (true redaction + contact line rewritten); ⚠ **the Owner should still open both PDFs** in `assets/cv/` before publishing |
| T-33 – T-34 | ✅ | detector proven red with the original PDF (`EXTRA_PDF=…`), green on the published PDFs |
| T-35 – T-36 | ✅ | `check-links.test.js` red → green; real run 24 links, 0 broken, 1 unverifiable (LinkedIn 999) |
| T-37 – T-38 | ✅ | styles, fonts, icons, favicon, og-image; UI wiring; visual review desktop/mobile EN/ES, 0 console errors, 0 horizontal overflow |
| T-39 – T-46 | ✅ | 22 E2E tests; first run found 2 real a11y issues (fixed) and 1 test bug (fixed) |
| T-47 – T-50 | ✅ | `build-site.test.js`, `workflows.test.js` red → green |
| T-51 | ✅ | `README.md`, `CLAUDE.md` commands |
| T-52 | ✅ | see §4 |
| T-53 | ❌ | waiting for the Owner's confirmation (make repo public, Pages source = GitHub Actions, push, PR, merge) |

## 3. Convention compliance
- [x] Vanilla HTML/CSS/JS ES modules, zero runtime dependencies, nothing loaded from CDNs (fonts self-hosted).
- [x] Content read from `content/*.json` by key; renderers are pure and separate from DOM wiring (`main.js`, `nav.js`, `effects.js`, `clipboard.js`, `language-switch.js`).
- [x] CSS custom properties for tokens, mobile-first, motion only under `prefers-reduced-motion: no-preference`.
- [x] Kebab-case files, camelCase functions, 2-space indent.
- [x] Vitest + jsdom unit tests and Playwright + axe E2E tests, Arrange / Act / Assert.
- [x] Content checks: key parity, links, no phone in any published file.
- [x] devDependencies only, all approved by the Owner; own scripts on Node built-ins.
- [x] Phone never published; no "Open to work" badge.
- [ ] ⚠ Minor: some test names omit the `when <condition>` part of the `should … when …` convention (e.g. `should show projects, contact and download actions`). They are still descriptive; renaming them is optional.
- [ ] ⚠ Approved exception D-03: `fallback-messages.js` and `<noscript>` hold hard-coded texts. In addition, the skip-link text and nav `aria-label` start in English in `index.html` and are replaced from the dictionaries at load.

## 4. Build & tests
```
npm test
 Test Files  23 passed (23)
      Tests  104 passed (104)

npm run test:e2e
  22 passed (9.5s)

npm run check:links
24 links checked: 0 broken, 1 unverifiable.

npm run build
Site built at C:\git\MyPage\_site
```

## 5. Missing / pending
- ❌ T-53: make `harlinacero.github.io` public, set Pages to deploy from GitHub Actions, push the branch, open the PR (verifies AC-28 live), merge (verifies AC-27 live).
- ⚠ The Owner reviews both redacted PDFs in `assets/cv/`.
- Nothing has been committed for this feature yet; only the removal of the old content is committed (`bf096a4`).

## 6. Deviations from spec
- `dates.js` uses fixed month abbreviations instead of `Intl` (tech spec updated).
- The deploy job publishes the `_site` artifact built by the quality job (tech spec updated).
- Three fonts instead of two: Inter was added for body text (tech spec updated).
- `ui.nav.label` and `ui.caseStudy.ownedBy` were added to both dictionaries.
- `cv.js` was implemented before the hero (task order). Details are in `03-tasks.md` › Implementation notes.

## 7. Risks & follow-ups
- **Feature 002:** live demos (video/GIF in case studies; front ends with mock data on Pages for medicalcenter / easyreports).
- LinkedIn cannot be checked automatically (status 999); it is reported as a warning only.
- External link checks in CI depend on GitHub availability; they are retried, and a real 404 still fails.
- Outside this feature: public READMEs of e-commerce-majestic-full (`admin/admin1234`, `harlin/1234`) and Microservices.Demo contain demo credentials that recruiters can see.
- The crawlers that don't run JS index only the English meta and the `<noscript>` block (D-01, D-07).
