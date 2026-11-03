# Farfield website

Static site for withfarfield.com. No build step.

## Before you publish
1. **Form.** Open `index.html`, find `FORM_ENDPOINT` near the bottom, and paste a form endpoint
   (for example a free Formspree form: https://formspree.io/f/xxxxxxxx). Until you do, the form
   opens an email to `hello@withfarfield.com`, so set up that mailbox or change `FALLBACK_EMAIL`.
2. **Confirm the copy** you are comfortable making public: the founding-cohort perks, the founder stories
   (anonymized, nothing firm-specific), and the IDC figure with its source.

## Publish on GitHub Pages
1. Put these files at the root of a repo (for example `farfield-website`) and push.
2. Settings > Pages > deploy from the `main` branch, root folder.
3. Settings > Pages > Custom domain: `withfarfield.com` (the `CNAME` file is already included).
4. At your registrar add four A records for `@`: 185.199.108.153, 185.199.109.153,
   185.199.110.153, 185.199.111.153, and a CNAME for `www` pointing to `<your-username>.github.io`.
5. When GitHub's DNS check passes, tick Enforce HTTPS.

Screenshots in `assets/` are from the working prototype and show sample data.
