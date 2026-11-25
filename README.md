# Farfield website

Three pages: `index.html` (Home), `product.html` (Product) and `team.html` (Careers). Keep these filenames so existing links keep working.

Shared files live in `assets/`:
- `site.css`: the original site's stylesheet, followed by a "light layer" that recolors it to the beige palette and a "round 3" block that sets the font and spacing. Change colors in the `:root` block of the light layer.
- `site.js`: mobile menu, reveal on scroll, the ripple field (hero, contact band, Product and Careers headers), the pinned "How it works" steps, the fix-ticket tabs and the release-check demo. Motion switches off for visitors who ask for reduced motion.
- `lockup_light.png`: the original FARFIELD logo, dark-ink version, used unchanged in the nav and footer.
- `logos/`: Citadel, Goldman Sachs, NVIDIA and Penn, shown in transparent black by CSS.
- `og.png` (share image, 1200x630), `favicon-64.png`, `apple-touch-icon.png`.

## How changes reach withfarfield.com
The site is served by GitHub Pages from this repo. `CNAME` points Pages at withfarfield.com; the domain's DNS is managed at Northwest Registered Agent.
There is no build step or deploy workflow: whatever is on `main` goes live about a minute after it changes.
So work on a branch, review a preview, and only merge to `main` when it is approved. Leave `CNAME` alone.

## Look and feel
- Layout and motion from the original site: ripple field, reveal on scroll, pinned "How it works" steps, looping figure animations.
- Type: Hanken Grotesk 400/500/600, self-hosted in `assets/fonts/` (no Google Fonts request). The FARFIELD logo is an image and is unchanged.
- Beige page `#F4F3EF`, ink `#0B0E14`, one blue accent `#2A4BD0`, light figure cards with a black top rule, faint lavender `#EFEDF8` for highlight boxes. No dark sections.

## Booking and contact
Every "Book a demo" button opens the Google Calendar booking page in a new tab. Search for `calendar.app.google` to change it.
The Contact section uses `mailto:contact@withfarfield.com`.

## The Careers form
Submissions go to a private Google Sheet through a small Google Apps Script (`tools/careers-form.gs`).
Until `JOIN_ENDPOINT` in `team.html` is filled in, the form opens an email to contact@withfarfield.com instead.

One-time setup (about 10 minutes):
1. Sign in to the Google account that should own the answers. Create a new Google Sheet, for example "Farfield careers". Don't share it with anyone.
2. In the sheet: Extensions > Apps Script. Delete the sample code, paste in all of `tools/careers-form.gs`, and save.
3. Deploy > New deployment > gear icon > Web app.
   - Execute as: **Me**
   - Who has access: **Anyone** (this lets the website send rows in; it does not let anyone read the sheet)
4. Click Deploy and approve the permissions. Google will say the app isn't verified because it's your own script: click Advanced, then Go to the project.
5. Copy the Web app URL (it ends in `/exec`) and paste it between the quotes of `var JOIN_ENDPOINT = "";` in `team.html`.
6. Submit a test entry on the site and check that a "Submissions" tab appears in the sheet with your row.

How it stays private:
- The sheet is never shared. The script runs as you, can only add rows, and never sends sheet data back. There is no way to read submissions through the URL.
- It drops spam (the hidden "Leave this empty" field), checks every field, caps lengths, blocks spreadsheet formulas, ignores repeat submissions from the same email within 10 minutes, and accepts at most 30 submissions an hour.
- You get an email saying "New Careers submission: <name>" with a link to the sheet. The answers themselves are not in the email. To turn it off, set `NOTIFY_OWNER = false`.
- Optional: `deleteOldSubmissions` removes rows older than a year. Run it by hand, or add a daily trigger (Apps Script > Triggers).
- If you change the script later, use Deploy > Manage deployments > Edit > New version, so the URL stays the same.
- If your Google Workspace admin blocks "Anyone" web apps, use a personal Google account or ask the admin to allow it.
