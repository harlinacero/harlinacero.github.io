# harlinacero.github.io

Public bilingual (EN/ES) CV & portfolio of Harlin Acero, served by GitHub Pages at https://harlinacero.github.io.

## SDD Conventions

### Structure
- Single static site at repo root (no service folders); features in `features/NNN-kebab-case-name/`
- `index.html` · `assets/css/` · `assets/js/` (ES modules, no bundler) · `assets/img/` · `assets/cv/` (PDFs)
- `content/{en,es}.json` (all UI and CV texts) · `content/projects.json` (featured projects) · other data in `content/`
- Tests: `tests/unit/` (Vitest) · `tests/e2e/` (Playwright)

### Code style
- Vanilla HTML5/CSS3/JS (ES2022 modules), zero runtime dependencies
- Content is never hard-coded in HTML/JS: always read from `content/*.json` by key
- Pure logic (language resolution, content rendering) in small testable modules, separate from DOM wiring
- CSS: custom properties for design tokens, mobile-first, `prefers-reduced-motion` respected
- File names kebab-case, functions/variables camelCase, 2-space indent

### Testing
- Unit: Vitest + jsdom (`tests/unit/*.test.js`) · E2E/accessibility: Playwright + axe (`tests/e2e/*.spec.js`)
- Names: `it('should <expected behavior> when <condition>')`; Arrange / Act / Assert
- Content checks: `en.json` and `es.json` have identical keys; all content links valid; no phone number in any published file (pages or PDFs)

### Dependencies & config
- npm, devDependencies only (vitest, jsdom, @playwright/test, @axe-core/playwright, unpdf); serve, link check and build are own scripts on Node built-ins (`scripts/`); any new dependency is flagged to the Owner first

### Commands
- Install: `npm ci` · Unit: `npm test` · E2E: `npm run test:e2e` · Local server: `npm run serve`
- Link check: `npm run check:links` · Build publishable site: `npm run build` (→ `_site/`)

### Deploy
- GitHub Actions: on PR → run checks only; on push to `master` → checks + deploy to GitHub Pages
- Repository visibility and Pages settings are changed only with the Owner's explicit confirmation

### Git
- Main branch: `master` (features are cut from it and PRs target it)
- Feature branches: `feature/NNN-kebab-case-name` (same as the feature folder name)

### Business glossary & rules
- **Owner**: Harlin Acero, the only person who changes and publishes content. **Visitor**: anonymous reader.
- Positioning: Software Engineer & Software Architect; architecture and leadership evidence comes first.
- Every visible text exists in English and Spanish; proper nouns are not translated.
- The phone number is never published (neither pages nor PDFs). No "Open to work" badge.
