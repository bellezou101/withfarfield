# Farfield website

Three pages: `index.html` (Home), `product.html` (Product) and `team.html` (Careers). Keep these filenames so existing links keep working.

Shared files live in `assets/`:
- `site.css`: the original site's stylesheet, followed by a "light layer" at the bottom that recolors it to the beige palette. Change colors in the `:root` block of that layer.
- `site.js`: mobile menu, reveal on scroll, the ripple field (hero, contact band, Product and Careers headers), the pinned "How it works" steps, the fix-ticket tabs and the release-check demo. Motion switches off for visitors who ask for reduced motion.
- `lockup_light.png`: the original FARFIELD logo, dark-ink version, used unchanged in the nav and footer.
- `logos/`: Citadel, Goldman Sachs, NVIDIA and Penn, shown in transparent black by CSS.
- `og.png` (share image, 1200x630), `favicon-64.png`, `apple-touch-icon.png`.

## How changes reach withfarfield.com
The site is served by GitHub Pages from this repo. `CNAME` points Pages at withfarfield.com; the domain's DNS is managed at Northwest Registered Agent.
There is no build step or deploy workflow: whatever is on `main` goes live about a minute after it changes.
So work on a branch, review a preview, and only merge to `main` when it is approved. Leave `CNAME` alone.

## Look and feel
- Same layout, type and motion as the original site: titles in Newsreader, body in Inter, small labels in IBM Plex Mono (Google Fonts).
- Beige page `#F4F3EF`, ink `#0B0E14`, one blue accent `#2A4BD0`, light figure cards with a black top rule, faint lavender `#EFEDF8` for highlight boxes. No dark sections.

## Booking and contact
Every "Book a demo" button opens the Google Calendar booking page in a new tab. Search for `calendar.app.google` to change it.
The Contact section uses `mailto:contact@withfarfield.com`.

## The Careers form
In `team.html`, `JOIN_ENDPOINT` is empty, so a submission opens an email to contact@withfarfield.com with the answers filled in, and the page shows a confirmation.
To collect entries in a sheet instead, paste a form URL (for example a Google Apps Script web app) into `JOIN_ENDPOINT`.
