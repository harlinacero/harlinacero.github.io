# harlinacero.github.io

Public bilingual (English / Spanish) CV and portfolio of **Harlin Acero**, Software Engineer & Software Architect, served by GitHub Pages at **https://harlinacero.github.io**.

- Professional profile with leadership and architecture highlights, experience, skills, education and certifications.
- Three architecture case studies with generated diagrams, key decisions and trade-offs.
- Featured public repositories with links to the code (and live demos when they exist).
- One-click language switch (remembered per visitor, shareable with `?lang=en` / `?lang=es`).
- Static HTML, CSS and JavaScript with no runtime dependencies or third-party requests.

## Editing the content

All the content lives in `content/`. To change it you never need to touch HTML or CSS.

| File | What it holds |
|------|---------------|
| `content/en.json`, `content/es.json` | Every visible text, one file per language, with **identical keys** |
| `content/profile.json` | Contact links, photo, CV files, dates, the order of sections and items |
| `content/projects.json` | Featured projects: repository, companions, tags, `demoUrl`, `caseStudyId` |
| `content/case-studies.json` | Diagram topology (layers, nodes, interactions), decisions and qualities |
| `assets/cv/` | The downloadable CV PDFs (they must not contain the phone number) |

- **Add a live demo:** set `demoUrl` on the project in `projects.json`. The "Live demo" button appears only when it is set.
- **Add a text:** add the same key to `en.json` and `es.json`. The quality check fails if one language is missing a key.

## Commands

```bash
npm ci                 # install dev dependencies
npm run serve          # local server at http://localhost:4173
npm test               # unit tests (Vitest + jsdom)
npm run test:e2e       # browser, mobile and accessibility tests (Playwright + axe)
npm run check:links    # verify every link in the content and index.html
npm run build          # assemble the publishable site into _site/
```

## Publishing

GitHub Actions (`.github/workflows/`):

- **Pull requests** run the full quality check and never publish.
- **Pushes to `master`** run the quality check and, only if everything passes, deploy `_site/` to GitHub Pages. If anything fails, the previous version stays online.

Repository settings: the repository must be public, with **Settings › Pages › Source = GitHub Actions**.

## How it was built

The feature was developed spec-first. The business spec, technical spec, TDD task list and checklist are in `features/001-public-cv-portfolio/`.
