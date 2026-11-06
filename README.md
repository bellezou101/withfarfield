# Farfield website

Three pages: `index.html` (home), `product.html`, and `team.html` (Careers).
Everything the pages need is inside the files, apart from the favicon and share image in `assets`.

## Update the live site
1. In your GitHub repo, click Add file > Upload files.
2. Drag in `index.html`, `product.html`, `team.html`, and the `assets` folder. Leave `CNAME` alone.
3. Commit. Wait a minute, then hard refresh withfarfield.com (Cmd+Shift+R).
4. Optional clean-up: in the repo's `assets` folder, the old photos, fonts, and screenshots are no longer used and can be deleted.

## Look and feel
- Backgrounds: ink (#06080C), electric blue (#2A50E6), and chalk (#EDEFF4). Change them in the `:root` block at the top of the CSS.
- Fonts: titles in Newsreader, body in Inter, small labels in IBM Plex Mono, all loaded from Google Fonts.
- The field of marks in the hero and the closing band is drawn in the page script. It bends around the pointer, ripples on click,
  pauses off screen, and is switched off for visitors who ask their device to reduce motion.

## Booking
Every "Book a demo" button opens your Google Calendar booking page in a new tab.
To change it, search for `calendar.app.google` in the three HTML files.

## The Careers form
Submissions go nowhere until you connect a form. In `team.html`, find `JOIN_ENDPOINT` near the bottom and paste your form URL
(see farfield-form-script.gs for the free Google Sheets setup). Until then, the form opens an email to hello@withfarfield.com.
