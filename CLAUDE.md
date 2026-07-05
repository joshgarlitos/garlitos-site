# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Josh Garlitos, Principal Product Manager at Amazon Health. The site is a single-page static HTML website with no build process or dependencies.

## Architecture

**Single File Structure**: The homepage is contained in `index.html` with inline CSS styling. There are no external stylesheets, JavaScript files, or build dependencies. Each note under `notes/` is a standalone HTML file with its own inline styles.

**Assets Directory**: The `images/` directory exists for assets but is not currently used by the homepage.

**Design Philosophy**: Clean, minimal, text-first design. Warm off-white paper background, generous whitespace, system fonts, and a single deep olive accent for links. No cards, banners, or profile photos on the homepage. A faint notebook graph-paper grid (`#e7e6db`, 28px) sits behind the page on most surfaces; on note detail pages it fades out before the prose body so long reading passages stay on plain paper.

**Responsive Design**: Mobile-first approach with a single breakpoint at 768px that bumps body padding and h1 size.

## Development

Since this is a static HTML site with no build tools:

- **Preview changes**: Open `index.html` directly in a browser
- **Run tests**: `npm test` runs HTML validation, accessibility checks, and notes validation
- **Test individual suites**: `npm run test:html`, `npm run test:a11y`, `npm run test:notes`

## Content Structure

The homepage (`index.html`) follows this section order:
1. Header — Name (h1), title/subtitle, and contact links (Email, LinkedIn, Notes)
2. About — Two short professional summary paragraphs
3. Recent Notes — Latest note(s) surfaced inline, with a "View all notes →" link to `/notes/`
4. Experience — Amazon role timeline (with vertical dotted timeline UI) followed by prior roles as flat entries

There is no footer on the homepage.

## Styling Conventions

- **Font System**: Uses system fonts via `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Color Palette** (Garlitos Design System):
  - Primary text: `#1a1a1a`
  - Secondary/muted text: `#6a6a64`
  - Page background: `#fcfcfa` (warm off-white)
  - Accent olive (links, default state): `#59670f`
  - Link hover: `#1a1a1a` (darkens to ink, never brightens)
  - Borders/dividers: `#e5e3d8`
  - Timeline rail: `#d8d6c8`
  - Tag/chip background: `#f2f1e8`
  - Tag hover: `#e5e3d8`
  - Breadcrumb separator: `#cccccc`
  - Notebook grid line: `#e7e6db`
  - Highlighter: `#d6f84a` (chartreuse, `mix-blend-mode: multiply`, used via `<mark>` in About section only)
- **Layout**:
  - Centered container, `max-width: 48rem`
  - Body padding: `2rem 1.5rem` (mobile), `4rem 1.5rem` (≥768px)
  - Section spacing: `4rem` bottom margin between sections
- **Timeline (Experience → Amazon)**:
  - `.positions-timeline` uses a 1px vertical rail with circular dots on each `.position-item`
- **Tags**: Pill-shaped, `#f2f1e8` background, `12px` border-radius, used inline under note descriptions; hover → `#e5e3d8`
- **Interactive Elements**: Links transition `color` on hover (0.2s); hover darkens from olive `#59670f` to ink `#1a1a1a`
- **Design System reference**: `~/Projects/design-system/` — tokens, components, and guidelines. The site's inline CSS values must match the tokens in `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`.

## Notes Section

The site includes a **Notes** section (`/notes/`) - a collection of living topic pages organized by tags.

### Notes Structure

```
notes/
├── index.html          (notes listing page, with sections per type e.g. "Projects")
├── generide.html       (project note)
└── [future-note].html  (new notes added over time)
```

### Adding a New Note

1. Create a new HTML file in `notes/` using an existing note as a template
2. Required meta tags for each note:
   - `<title>` - Note title followed by "- Josh Garlitos"
   - `<meta name="description">` - Brief description for SEO
   - `<meta name="keywords">` - Comma-separated tags
   - `<link rel="canonical">` - Full URL to the note
3. Update `notes/index.html` to include the new note card with:
   - Title and link
   - Last updated date
   - Description
   - Tags
4. Add the note's canonical URL to `sitemap.xml` with today's date as `<lastmod>`, and bump the `<lastmod>` on `https://www.garlitos.com/notes/` since the index changed
5. Run `npm test` to validate all notes

### Note Page Template Structure

- Breadcrumb: Home → Notes → Note Title
- Title (h1)
- Tags displayed as visual labels
- Last updated date (subtle)
- Content sections (h2, h3, paragraphs, lists)
- Related notes section (optional)
- Footer with links back to home and notes index

### Validation

The `test-notes.js` script checks:
- All HTML files in `notes/` are listed in the index
- No broken internal links between notes
- All note pages have required meta tags (title, description, canonical)

## Discoverability

- `sitemap.xml` at the repo root lists every public canonical URL with a `<lastmod>` date. Update it whenever a page is added, removed, or meaningfully changed.
- `robots.txt` at the repo root allows all crawlers and points to `https://www.garlitos.com/sitemap.xml`.
- Every page should declare its canonical URL via `<link rel="canonical" href="...">` in `<head>`, matching the URL listed in `sitemap.xml`.
