# [001] Public CV & Portfolio — Business Specification

> Status: Approved (2026-10-23)
> Owning service: repo root (single static site)
> Author / requested by: Harlin Acero

## 1. Summary
A public, visually striking bilingual (English/Spanish) website at `https://harlinacero.github.io` that works as Harlin Acero's online CV and portfolio, positioning him as a Senior Full Stack Software Engineer ready for Tech Lead / junior Software Architect roles, and linking his public GitHub projects. Its main purpose is to **sell** him as a Software Engineer and Software Architect: every section must reinforce architecture and technical-leadership capability, not just list technologies.

## 2. Business goal / problem
- Today there is no public CV: recruiters only see a LinkedIn profile, a PDF sent on request, and a GitHub profile with no bio and no curated project list.
- The site must give a recruiter or hiring manager, in under a minute, a clear picture of: who Harlin is, 10+ years of experience, proven leadership (Tech Lead of 6+ developers) and architecture work, and real code they can open.
- The positioning is **Software Engineer → Software Architect**: the site must show *how he designs systems* (architecture styles, decisions and trade-offs, diagrams), not only what he has coded.
- It must serve both Spanish-speaking (Colombia/LatAm) and English-speaking (international/remote) employers equally well.
- Hosting must rely only on GitHub's free public page hosting — no paid servers or third-party back ends.

## 3. Actors
| Actor | Description | Role / permission |
|-------|-------------|-------------------|
| Visitor | Recruiter, hiring manager, engineer or anyone with the link, on desktop or phone | Anonymous, read-only |
| Owner | Harlin Acero, who maintains the content | Only person who can change and publish content |

## 4. User stories
- **US-01** — As a Visitor, I want to see Harlin's professional profile (headline, summary, leadership & architecture highlights, experience, skills, education, certifications, languages) so that I can quickly judge his fit for a senior, lead or architecture role.
- **US-02** — As a Visitor, I want to switch the whole site between English and Spanish with one button so that I can read it in my language.
- **US-03** — As a Visitor, I want to browse Harlin's featured projects with a short description and buttons to open the code (and a live demo when one exists) so that I can verify his work.
- **US-04** — As a Visitor, I want to contact Harlin or download his CV so that I can move him forward in a hiring process.
- **US-06** — As a Visitor, I want to see architecture case studies of Harlin's projects (diagram, context, key decisions and trade-offs) so that I can evaluate his ability as a Software Architect.
- **US-05** — As the Owner, I want to update the content in both languages and have it published automatically, with a quality check that stops broken or incomplete content, so that the public site is never left broken or half-translated.

## 5. Business rules
- **BR-01** — Every visible text (including button labels, section titles and project descriptions) exists in English and Spanish. Proper nouns (company names, technologies, project names) are not translated.
- **BR-02** — First-visit language: Spanish if the visitor's browser prefers Spanish; English otherwise.
- **BR-03** — The visitor's language choice is remembered for later visits on the same device; an explicit language in the shared link takes precedence over both the remembered choice and the browser preference.
- **BR-04** — Switching language changes all content immediately, without leaving the page or losing the visitor's position.
- **BR-05** — Featured projects (initial selection, in this order): Microservices.Demo, EmployeeAttendanceControl, e-commerce-majestic-full, EasyReportsIA (with easyreports as its companion), medicalcenter. Forks and minor exercises (BuscadorPHP, ChatRealTime, etl-python.-excersice, Microservices.Demo-config, the two forks) are not shown. The Owner can change the selection and order.
- **BR-06** — Every featured project offers a "View code" action that opens its public repository in a new tab. A "Live demo" action is shown only when that project has a demo address; a project never shows a broken or empty demo action.
- **BR-07** — Leadership and architecture evidence is shown prominently, above the detailed experience: leading 6+ developers, defining the annual application roadmap, code reviews and design proposals, documenting the architecture of 10+ micro-applications, replacing manual deployments with CI/CD, integrating products through microservices and Single Sign-On, and building the results-measurement layer at Mercado Libre.
- **BR-08** — Public contact data: email, LinkedIn and GitHub. The phone number is **not** published anywhere — neither on the site pages nor inside the downloadable CV PDFs (the site is public and indexable). The published PDFs are copies of the Owner's PDFs with the phone number removed and the rest unchanged.
- **BR-09** — The CV download offers the PDF in the current language; if that language's PDF is not available, the Spanish PDF is offered and clearly labeled as Spanish.
- **BR-10** — The site is readable and usable on phones, tablets and desktops, by keyboard, and by screen readers; visitors who ask their device for reduced motion get no decorative animations.
- **BR-11** — Content is published only if it passes the quality check: both languages complete (BR-01), every link valid, and the site's own checks passing. If publishing fails, the previously published version stays online.
- **BR-13** — Positioning: the headline presents Harlin as "Software Engineer & Software Architect" with the supporting line "10+ years · Tech Lead · Microservices · Cloud (Azure)". The profile summary leads with architecture and leadership, then full-stack delivery. Skills are presented architecture-first (architecture styles and patterns, then cloud/DevOps, messaging/data, languages/frameworks, observability).
- **BR-14** — Architecture case studies exist (initially) for Microservices.Demo, e-commerce-majestic-full and EmployeeAttendanceControl, derived from each repository's README and code. Each has, in both languages: the problem/context, an architecture diagram with a text alternative, 3–5 key decisions each with its trade-off, the quality attributes addressed (e.g. scalability, resilience, observability) and a link to the code. The Owner can add more case studies.
- **BR-15** — The hero shows Harlin's professional photo (initially the one on his GitHub profile) with a descriptive text alternative. No "Open to work" badge or availability status is shown anywhere (Owner's decision).
- **BR-16** — Mercado Libre achievement wording: he operated the productization-request pipeline with peaks of 60,000 requests per day, all processed without failures; requests may still end unproductized because of internal and cross-team validations, which is what the measurement layer he built made visible.
- **BR-17** — Content source: the site uses the union of both CVs (Owner's PDFs `Harlin_Acero_Resume_EN_FullStackNET.pdf` and `Harlin_Acero_CV_ES_FullStack.pdf`), taking the richer English version as the base (leadership & security skills, on-call, mentoring, DIAN Annex 1.9, 300,000+ users, Kubernetes, Azure Service Bus, testing) and showing identical content in both languages. Digitalware is shown as one company with a visible career progression (Junior Developer → Senior Developer → Development Coordinator / Tech Lead), to highlight growth into leadership. The Fundación Universitaria Konrad Lorenz work (Clinical Psychology Center information-management system, 2015–2016) is **not** professional experience: it is shown under Education, as the degree (thesis) project of the B.Sc. in Systems Engineering.
- **BR-12** — Visual style: dark "tech" look with neon accents and gradients, scroll-revealed sections and a hero that "types" the headline like a terminal.

## 6. Use cases

### UC-01 — View the professional profile (US-01)
- **Actor:** Visitor
- **Preconditions:** The site is published.
- **Main flow:**
  1. The Visitor opens the site link.
  2. The system shows the hero: professional photo (BR-15), name, headline and supporting line (BR-13), location, a short pitch and quick actions (projects, contact, download CV).
  3. The system shows, in order: leadership & architecture highlights (BR-07), profile summary, architecture case studies (UC-06), experience timeline (role, company, period, achievements, newest first), skills grouped by area, featured projects (UC-03), education, certifications (including those in preparation), languages and contact (UC-04).
  4. The Visitor scrolls or uses the navigation menu to jump to any section.
- **Alternative flows:**
  - **A1** (at 1) — The link points to a specific section → the system opens the page already positioned on that section.
  - **A2** (at 2–3) — The Visitor uses a phone → the menu collapses into a toggle and the content stacks in one column; nothing is cut off or requires horizontal scrolling.
  - **A3** (at 2–3) — The Visitor's device asks for reduced motion → content is shown without typing or reveal animations.
  - **A4** (at 4) — The Visitor navigates by keyboard → every menu entry and action is reachable and visibly focused.
- **Exception flows:**
  - **E1** (at 2) — The CV content cannot be loaded → the system shows a short apology in the visitor's language with links to LinkedIn and the CV PDF, instead of a blank or broken page.
  - **E2** (at 2) — The Visitor's browser has scripts disabled → the system shows a message with the name, headline and links to LinkedIn, GitHub and the CV PDF.
- **Postconditions:** The Visitor has seen the full profile, or on failure has at least a working path to the CV.

### UC-02 — Switch language (US-02)
- **Actor:** Visitor
- **Preconditions:** UC-01 in progress.
- **Main flow:**
  1. The system determines the initial language (BR-02, BR-03) and shows all content in it; the language button shows the other language as the option (e.g. "ES" while reading English).
  2. The Visitor presses the language button.
  3. The system shows all content in the other language at once, keeping the Visitor at the same position (BR-04), and updates the button.
  4. The system remembers the choice (BR-03).
- **Alternative flows:**
  - **A1** (at 1) — Browser prefers Spanish (any regional variant) and no remembered choice → Spanish.
  - **A2** (at 1) — Browser prefers any other language and no remembered choice → English.
  - **A3** (at 1) — Returning Visitor with a remembered choice → that language.
  - **A4** (at 1) — The link explicitly names a language → that language, regardless of A1–A3.
- **Exception flows:**
  - **E1** (at 3) — A specific text is missing in the chosen language → the text is shown in the other language rather than left blank or showing an internal placeholder. (BR-11 should prevent this from ever being published.)
  - **E2** (at 4) — The device does not allow remembering preferences (e.g. private browsing) → switching still works; the choice is simply not remembered.
  - **E3** (at 1) — The link names an unsupported language → treated as if no language were named (A1–A3 apply).
- **Postconditions:** All content is in the chosen language; the choice is remembered when possible.

### UC-03 — Browse featured projects and open repositories/demos (US-03)
- **Actor:** Visitor
- **Preconditions:** UC-01 in progress.
- **Main flow:**
  1. The Visitor reaches the Projects section.
  2. The system shows each featured project (BR-05) as a card with: name, short description in the current language, what it demonstrates (e.g. microservices, event-driven messaging, API Gateway), and technology tags.
  3. The Visitor presses "View code".
  4. The system opens the project's public repository in a new tab, leaving the CV open.
  5. A link to the full GitHub profile is available for the rest of the repositories.
- **Alternative flows:**
  - **A1** (at 2) — The project has a demo address → the card also shows a "Live demo" action that opens the demo in a new tab.
  - **A2** (at 2) — The project has a companion repository (EasyReportsIA + easyreports) → both repositories are reachable from the same card, each clearly labeled.
- **Exception flows:**
  - **E1** (at 2) — The project has no demo address → no "Live demo" action is shown (BR-06).
  - **E2** (at 4) — A repository no longer exists or became private → prevented at publication time by the link check (UC-05 E2).
- **Postconditions:** The Visitor has opened the code or demo in a new tab with the CV still open.

### UC-04 — Contact Harlin or download the CV (US-04)
- **Actor:** Visitor
- **Preconditions:** UC-01 in progress.
- **Main flow:**
  1. The Visitor reaches the Contact section (or uses the quick actions in the hero).
  2. The system shows email, LinkedIn and GitHub (BR-08) and a "Download CV" action.
  3. The Visitor chooses email → their mail application opens a new message addressed to Harlin; or chooses LinkedIn/GitHub → it opens in a new tab.
  4. The Visitor chooses "Download CV" → the system provides the PDF in the current language (BR-09).
- **Alternative flows:**
  - **A1** (at 4) — No PDF exists for the current language → the Spanish PDF is offered, labeled "(Spanish)" / "(Español)".
- **Exception flows:**
  - **E1** (at 3) — The Visitor's device has no mail application → the email address is visible as text and can be copied with one action, with a confirmation that it was copied.
- **Postconditions:** The Visitor has a way to reach Harlin and/or a copy of the CV.

### UC-06 — Explore an architecture case study (US-06)
- **Actor:** Visitor
- **Preconditions:** UC-01 in progress; at least one case study exists (BR-14).
- **Main flow:**
  1. The Visitor reaches the Architecture section, or presses "Architecture" on a project card that has a case study.
  2. The system shows the case study in the current language: context, architecture diagram, key decisions with trade-offs, quality attributes and a "View code" action.
  3. The Visitor reads it and either opens the code (new tab) or returns to where they were.
- **Alternative flows:**
  - **A1** (at 1) — The site has several case studies → the Visitor can move between them without leaving the page.
  - **A2** (at 2) — Phone-width screen → the diagram stays legible (fits the width or can be panned inside its own frame) without horizontal page scrolling.
  - **A3** (at 2) — The Visitor switches language while viewing a case study → its texts, diagram labels and decisions change language and the Visitor stays on the same case study.
- **Exception flows:**
  - **E1** (at 1) — The project has no case study → its card shows no "Architecture" action.
  - **E2** (at 2) — The Visitor cannot see the diagram (screen reader or the diagram fails to display) → the text alternative describing components and their interactions is available.
- **Postconditions:** The Visitor has understood how Harlin designed the system and can open its code.

### UC-05 — Update and publish content (US-05)
- **Actor:** Owner
- **Preconditions:** The Owner can modify the site's source.
- **Main flow:**
  1. The Owner edits the content (texts per language, experience, projects, demo addresses, PDFs) in one place, without touching the design.
  2. The Owner submits the change to the main version of the site.
  3. The system runs the quality check (BR-11).
  4. The system publishes the new version at the public address.
- **Alternative flows:**
  - **A1** (at 2) — The Owner proposes the change for review before it reaches the main version → the quality check runs on the proposal and reports its result, without publishing.
- **Exception flows:**
  - **E1** (at 3) — A text exists in only one language → publication is rejected, listing the missing texts.
  - **E2** (at 3) — A link (repository, demo, LinkedIn, PDF) is broken → publication is rejected, naming the link.
  - **E3** (at 3) — Any other site check fails → publication is rejected with the failing check.
  - **E4** (at 4) — Publication itself fails → the previously published version remains online and the Owner is notified.
- **Postconditions:** The public site shows the new content; on any failure it still shows the last good version.

## 7. Acceptance criteria
- **AC-01** (UC-01 main, BR-07) — *Given* the site is published, *When* a Visitor opens it, *Then* the hero shows name, headline, location and the three quick actions, followed by the sections in the order of UC-01 step 3, with the leadership & architecture highlights before the experience timeline.
- **AC-02** (UC-01 main) — *Given* the experience content, *When* the timeline is shown, *Then* it lists Mercado Libre, Siigo, Digitalware (with its three roles as a progression: Junior → Senior → Tech Lead), and PIV Ingeniería, newest first, each with role, company, period and achievements; Fundación Universitaria Konrad Lorenz does not appear as an employer.
- **AC-03** (UC-01 step 4) — *Given* the page is open, *When* the Visitor picks a section in the navigation menu, *Then* the page moves to that section.
- **AC-04** (UC-01 A1) — *Given* a link that names a section, *When* the Visitor opens it, *Then* the page opens positioned on that section.
- **AC-05** (UC-01 A2, BR-10) — *Given* a phone-width screen, *When* the page is shown, *Then* the menu is collapsed behind a toggle and there is no horizontal scrolling.
- **AC-06** (UC-01 A3, BR-10) — *Given* the device asks for reduced motion, *When* the page is shown, *Then* the headline appears complete at once and no reveal animations run.
- **AC-07** (UC-01 A4, BR-10) — *Given* keyboard-only navigation, *When* the Visitor tabs through the page, *Then* every menu entry, button and link is reachable in a logical order with a visible focus indicator, and an automated accessibility check reports no serious issues.
- **AC-08** (UC-01 E1) — *Given* the CV content cannot be loaded, *When* the page is shown, *Then* a message in the visitor's language appears with working links to LinkedIn and the CV PDF.
- **AC-09** (UC-01 E2) — *Given* scripts are disabled, *When* the page is shown, *Then* the name, headline and links to LinkedIn, GitHub and the CV PDF are visible.
- **AC-10** (UC-02 main, BR-04) — *Given* the page is shown in English and the Visitor is scrolled to Projects, *When* they press the language button, *Then* every visible text is in Spanish, the Visitor is still at Projects, and the button now offers "EN"; pressing it again restores English.
- **AC-11** (UC-02 A1) — *Given* a browser preferring `es-CO` (or any Spanish variant) and no remembered choice, *When* the site opens, *Then* it is in Spanish.
- **AC-12** (UC-02 A2) — *Given* a browser preferring French and no remembered choice, *When* the site opens, *Then* it is in English.
- **AC-13** (UC-02 A3, main step 4) — *Given* a Visitor chose Spanish on a previous visit, *When* they return with an English-preferring browser, *Then* the site opens in Spanish.
- **AC-14** (UC-02 A4) — *Given* a link naming English and a remembered choice of Spanish, *When* the site opens, *Then* it is in English.
- **AC-15** (UC-02 E1) — *Given* a text exists only in English, *When* the site is shown in Spanish, *Then* that text appears in English and no blank or placeholder is visible.
- **AC-16** (UC-02 E2) — *Given* the device does not allow remembering preferences, *When* the Visitor switches language, *Then* the switch works and no error is shown.
- **AC-17** (UC-02 E3) — *Given* a link naming an unsupported language and a Spanish-preferring browser, *When* the site opens, *Then* it is in Spanish.
- **AC-18** (UC-03 main, BR-05) — *Given* the featured projects, *When* the Projects section is shown, *Then* exactly the featured projects appear in the configured order, each with name, description in the current language and technology tags, and no forks or minor exercises appear.
- **AC-19** (UC-03 main steps 3–5, BR-06) — *Given* any project card, *When* the Visitor presses "View code", *Then* that project's public repository opens in a new tab; and a link to the full GitHub profile is present.
- **AC-20** (UC-03 A1) — *Given* a project with a demo address, *When* its card is shown, *Then* a "Live demo" action pointing to that address and opening in a new tab is present.
- **AC-21** (UC-03 E1) — *Given* a project without a demo address, *When* its card is shown, *Then* no "Live demo" action is present.
- **AC-22** (UC-03 A2) — *Given* EasyReportsIA with companion easyreports, *When* its card is shown, *Then* both repositories are reachable from it with distinct labels.
- **AC-23** (UC-04 main, BR-08) — *Given* the Contact section, *When* it is shown, *Then* email (opens a new message), LinkedIn and GitHub (new tab) are present, and the phone number appears nowhere on the site pages nor in the text of either published CV PDF.
- **AC-24** (UC-04 step 4, BR-09) — *Given* PDFs exist for the current language, *When* the Visitor chooses "Download CV", *Then* the PDF of the current language is provided.
- **AC-25** (UC-04 A1) — *Given* the site is in English and only the Spanish PDF exists, *When* the Visitor chooses "Download CV", *Then* the Spanish PDF is provided and the action is labeled "(Spanish)".
- **AC-26** (UC-04 E1) — *Given* the Contact section, *When* the Visitor uses the copy-email action, *Then* the address is copied and a confirmation in the current language is shown.
- **AC-32** (UC-01 main, BR-13) — *Given* the site in either language, *When* the hero is shown, *Then* the headline reads "Software Engineer & Software Architect" (or its Spanish equivalent) with the supporting line, and the skills section lists architecture first.
- **AC-39** (UC-01 main, BR-15) — *Given* the site in either language, *When* the hero is shown, *Then* the photo is visible with a text alternative, and no "Open to work"/availability badge appears anywhere.
- **AC-41** (UC-01 main, BR-17) — *Given* the Education section, *When* it is shown, *Then* the B.Sc. in Systems Engineering (Konrad Lorenz, 2014–2018) includes its degree project: the information-management system for the university's Clinical Psychology Center.
- **AC-40** (UC-01 main, BR-16) — *Given* the Mercado Libre role, *When* the experience timeline is shown, *Then* the achievement states peaks of 60,000 productization *requests* per day processed without failures (not 60,000 productizations).
- **AC-33** (UC-06 main, BR-14) — *Given* the Architecture section, *When* the Visitor opens the Microservices.Demo case study (from the section or from its project card), *Then* context, diagram, 3–5 decisions each with a trade-off, quality attributes and a "View code" action opening the repository in a new tab are shown.
- **AC-34** (UC-06 A1) — *Given* two case studies, *When* the Visitor selects the other one, *Then* it is shown without leaving the page.
- **AC-35** (UC-06 A2) — *Given* a phone-width screen, *When* a case study is shown, *Then* the diagram is fully visible or pannable inside its frame and the page has no horizontal scrolling.
- **AC-36** (UC-06 A3) — *Given* a case study shown in English, *When* the Visitor switches to Spanish, *Then* the same case study is shown with its texts and diagram labels in Spanish.
- **AC-37** (UC-06 E1) — *Given* a project without a case study, *When* its card is shown, *Then* no "Architecture" action is present.
- **AC-38** (UC-06 E2) — *Given* any case study, *When* inspected by assistive technology, *Then* the diagram has a text alternative describing its components and interactions.
- **AC-27** (UC-05 main, BR-11) — *Given* a complete and valid content change on the main version, *When* the Owner submits it, *Then* the quality check passes and the new version is published at the public address.
- **AC-28** (UC-05 A1) — *Given* a change proposed for review, *When* it is submitted, *Then* the quality check runs and reports its result, and nothing is published.
- **AC-29** (UC-05 E1, BR-01) — *Given* a text present in only one language, *When* the quality check runs, *Then* it fails, naming the missing text.
- **AC-30** (UC-05 E2) — *Given* a broken link in the content, *When* the quality check runs, *Then* it fails, naming the link.
- **AC-31** (UC-05 E3, E4) — *Given* the quality check or publication fails, *When* the run ends, *Then* the previously published version is still online and the Owner is notified of the failure.

### Flow coverage
| Flow | AC |
|------|----|
| UC-01 main | AC-01, AC-02, AC-03 |
| UC-01 A1 | AC-04 |
| UC-01 A2 | AC-05 |
| UC-01 A3 | AC-06 |
| UC-01 A4 | AC-07 |
| UC-01 E1 | AC-08 |
| UC-01 E2 | AC-09 |
| UC-02 main | AC-10, AC-13 |
| UC-02 A1 | AC-11 |
| UC-02 A2 | AC-12 |
| UC-02 A3 | AC-13 |
| UC-02 A4 | AC-14 |
| UC-02 E1 | AC-15 |
| UC-02 E2 | AC-16 |
| UC-02 E3 | AC-17 |
| UC-03 main | AC-18, AC-19 |
| UC-03 A1 | AC-20 |
| UC-03 A2 | AC-22 |
| UC-03 E1 | AC-21 |
| UC-03 E2 | AC-30 |
| UC-04 main | AC-23, AC-24 |
| UC-04 A1 | AC-25 |
| UC-04 E1 | AC-26 |
| UC-01 main (positioning) | AC-32 |
| UC-01 main (photo, wording, education) | AC-39, AC-40, AC-41 |
| UC-06 main | AC-33 |
| UC-06 A1 | AC-34 |
| UC-06 A2 | AC-35 |
| UC-06 A3 | AC-36 |
| UC-06 E1 | AC-37 |
| UC-06 E2 | AC-38 |
| UC-05 main | AC-27 |
| UC-05 A1 | AC-28 |
| UC-05 E1 | AC-29 |
| UC-05 E2 | AC-30 |
| UC-05 E3 | AC-31 |
| UC-05 E4 | AC-31 |

## 8. Out of scope
- Contact form (email/LinkedIn links only), blog, analytics/visitor tracking, custom domain, content management interface.
- Light theme / theme toggle (single dark style, BR-12).
- Live repository statistics (stars, last update) loaded from GitHub.
- Publishing demos of the featured projects themselves (e.g. hosting medicalcenter as a live demo) — agreed as **feature 002** (Owner, 2026-10-23); this feature only shows demo actions for addresses the Owner provides.
- The old calculator exercise previously in this repository is deleted entirely (Owner's decision, 2026-10-23); it remains only in the git history.

## 9. Glossary (new terms only)
- **Featured project** — a public repository the Owner selected to show on the site, with bilingual description, tags and optional demo address.
- **Companion repository** — a second repository that belongs to the same featured project (e.g. easyreports for EasyReportsIA).
- **Quality check** — the automatic verification run before publishing: both languages complete, links valid, site checks passing.
- **Architecture case study** — a bilingual write-up of one project's design: context, diagram, key decisions with trade-offs, quality attributes.
- **Remembered choice** — the language a Visitor last selected, kept on their device.

## 10. Assumptions & open questions
- [x] Q-01 — CV PDFs. (answer: both provided — `Harlin_Acero_Resume_EN_FullStackNET.pdf` (EN) and `Harlin_Acero_CV_ES_FullStack.pdf` (ES). BR-09 fallback is kept for robustness. Content merged per BR-17.)
- [x] Q-02 — Photo. (answer: yes — LinkedIn profile photo, 375×375, provided by the Owner and stored with the site.)
- [x] Q-03 — "Open to work" badge. (answer: no — BR-15.)
- [x] Q-04 — Live demos. (answer: none today; all cards show only "View code". Building demos is a separate follow-up feature — see §8.)
- [x] Q-05 — Making the repository public and enabling GitHub Pages: explicit confirmation will be asked before doing it, at the end of implementation.
- [x] Q-06 — 60,000 daily. (answer: productization *requests*; all processed, not all productized due to internal/cross-team validations — BR-16.)
- [x] Q-07 — Project descriptions written from each repository's README/code; Owner reviews them in the content file.
- [x] Q-08 — Case studies. (answer: three — Microservices.Demo, e-commerce-majestic-full, EmployeeAttendanceControl — from each README and code; Owner validates.)
- [x] Q-09 — Phone number inside the PDFs. (answer: must not be published — BR-08. Phone-free copies are produced from the Owner's PDFs and reviewed by the Owner before publication.)
- [x] Q-10 — Konrad Lorenz. (answer: not an employer; shown as the B.Sc. degree/thesis project under Education — BR-17, AC-41.)
