# Leap of Faith — CMS-wired site

This is your Claude Design site with Sveltia CMS editing wired in. The design and
the editable content live separately, so client edits and future redesigns never
clash. Content is injected into the HTML automatically at build time on Cloudflare.

## Before you deploy

1. **Add your real image files** to `src/assets/` (keep the existing file names —
   see `src/assets/PUT-IMAGE-FILES-HERE.txt`). Delete that note file afterwards.
2. **Add the brand font** (`gistesy.woff2` / `.woff`) to `src/fonts/` if you have it.
   Without it the wordmark uses a script-style fallback, by design.
3. **Replace the placeholder icons** `src/favicon.svg` and `src/apple-touch-icon.png`
   with the real ones.
4. In `src/admin/config.yml`, change the `repo:` line to the real GitHub owner/repo.
   The `base_url:` is already set to your Sveltia connector.

## Deploy (per the BRD playbook)

- Push this folder to a GitHub repo.
- In Cloudflare Pages, connect the repo with **Build command** `npm run build` and
  **Build output directory** `dist`.
- Visit `/admin` on the published site to log in and edit.

## What the client can edit (via /admin)

- **Hero:** eyebrow line, sub-line, tagline
- **Story:** heading, body, signature name + location, photo + alt + caption
- **The Oil:** heading, tasting notes, notes sub-line, photo + alt
- **The Place:** heading, body
- **Enquire:** heading, body, estate address

## What is intentionally locked (edit in the HTML/CSS only)

- Brand wordmarks and nav (special font + brand identity)
- The specs list, the winter/summer/elevation stat panel, and section numerals
  (structured/decorative — can be added to the CMS on request)
- The contact **email** and its `mailto:` link (locked so the visible address and
  the link can't drift apart — ask to have it added if the client needs to change it)
- Hero and Place **background images** (set in CSS, not `<img>` tags)
- The enquiry form, Web3Forms config, SEO tags, and all styles/scripts

## Notes

- Editable body fields use Markdown (**bold**, etc.). Inline italics on the hero
  tagline and oil notes are edited as plain text.
- Editable photos are served as uploaded (their original WebP versions were removed
  so a new upload shows immediately). Locked/background images keep their WebP.
- If a content edit doesn't appear right away, it's usually CDN cache — hard-refresh.
