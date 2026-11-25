# Farfield website

Three pages: `index.html` (Home), `product.html` (Product) and `team.html` (Careers). Keep these filenames so existing links keep working.

Shared files live in `assets/`:
- `site.css`: the whole design system (colors at the top in `:root`).
- `site.js`: mobile menu, the fix-ticket tabs and the release-check demo.
- `fonts/`: Hanken Grotesk 400/500/600, self-hosted (no Google Fonts request). License in `fonts/hanken-grotesk-OFL.txt`.
- `logo-mark.svg`: the ring logo, dark-ink version for the beige background. `logo-ring-dark-ink.png` is the PNG it was redrawn from.
- `og.png` (share image, 1200×630), `favicon-64.png`, `apple-touch-icon.png`.

## How changes reach withfarfield.com
The site is served by GitHub Pages from this repo. `CNAME` points Pages at withfarfield.com; the domain's DNS is managed at Northwest Registered Agent.
There is no build step or deploy workflow: whatever is on `main` goes live about a minute after it changes.
So work on a branch, review a preview, and only merge to `main` when it is approved. Leave `CNAME` alone.

## Look and feel
- Beige page `#F4F3EF`, ink `#0B0E14`, secondary text `#4B5362`, one blue accent `#2A4BD0` for labels, numerals, links and thin lines.
- Cards `#FBFAF7` with a 4px black top border; faint lavender `#EFEDF8` for step and highlight boxes.
- Every section opens with a 2px black rule and a small numbered label.

## Booking and contact
Every "Book a demo" button opens the Google Calendar booking page in a new tab. Search for `calendar.app.google` to change it.
The Contact section uses `mailto:contact@withfarfield.com`.

## The Careers form
In `team.html`, `JOIN_ENDPOINT` is empty, so a submission opens an email to contact@withfarfield.com with the answers filled in, and the page shows a confirmation.
To collect entries in a sheet instead, paste a form URL (for example a Google Apps Script web app) into `JOIN_ENDPOINT`.
