# Vertex Dispatch Services — Website

The marketing website for Vertex Dispatch Services. **Always Moving. Always Paid.**

It's a plain static site (HTML, CSS and JavaScript) with no build step, so it runs on any static host: GitHub Pages, Netlify, Vercel or Cloudflare Pages.

## What's in it

- **Hero:** animated route-network background, the reversed badge with floating status cards, and a quick quote bar (equipment + phone) above the fold.
- **Services:** six service cards with 3D tilt and a cursor spotlight.
- **Equipment:** tabs for box truck, sprinter van, hotshot, dry van and reefer, with line-art trucks that draw themselves in.
- **Revenue calculator:** live sliders with equipment presets, animated numbers and bars.
- **Load feed preview:** sample loads with equipment filters, a rotating "new load" highlight and a "Book this load" action.
- **How it works:** four steps with a road line that fills as you scroll.
- **Brand statement:** "A vertex is the highest point…", with words lighting up as you scroll.
- **Going solo vs. Vertex:** comparison table.
- **Four promises:** Reliable, Transparent, Driver-first, Precise.
- **FAQ:** animated accordion.
- **Quote form:** three steps with validation, US phone formatting, equipment picker, consent checkbox and spam honeypot.
- Light and dark theme toggle, sticky header with scroll progress, mobile menu, sticky Call / Quote bar on mobile, back-to-top button, and a preloader.
- Accessible: keyboard friendly, skip link, ARIA states, and it respects "reduce motion" settings.
- Privacy policy page, custom 404 page, favicon set, web manifest, and social share image.

## Before going live: fill in your details

Open **`js/config.js`** and fill in the real details:

| Setting | Example |
|---|---|
| `phone` | `'+15551234567'` |
| `phoneDisplay` | `'(555) 123-4567'` |
| `email` | `'dispatch@yourdomain.com'` |
| `hours` | `'Mon to Sat, 6am to 10pm CT'` |
| `address` | `'123 Main St, Dallas, TX 75201'` |
| `legalName` | `'Your Company LLC'` |
| `mcdot` | leave `''` to hide the line |
| `formEndpoint` | `'https://formspree.io/f/xxxxxxx'` |

These values appear across the whole site and the privacy page. Per the brand guidelines, only publish real, verified details.

### Make the quote form send emails

1. Create a free account at [formspree.io](https://formspree.io) and create a new form.
2. Copy the form's endpoint URL, which looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it as `formEndpoint` in `js/config.js`.

Until you do this, the form runs in **demo mode**: it shows the success screen, but nothing is sent.

## Uploading to GitHub

1. Open the repository on GitHub and click **Add file → Upload files**.
2. Drag in **everything inside** the `vertex-site` folder (not the folder itself): `index.html`, `privacy.html`, `404.html`, `README.md`, `robots.txt`, `site.webmanifest`, and the `assets`, `css` and `js` folders.
3. Click **Commit changes**.

## Publishing with GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**, then select branch `main` and folder `/ (root)`. Click **Save**.
3. After a minute or two the site is live at `https://<username>.github.io/<repo>/`.

To use your own domain, add it under **Settings → Pages → Custom domain**. The 404 page uses root links (`/`), so it works fully on a custom domain.

## File structure

```
index.html          Main page
privacy.html        Privacy policy (template, have it reviewed)
404.html            "Wrong exit" page
site.webmanifest    App icon / install info
robots.txt
css/styles.css      All styles (brand colors at the top)
js/config.js        Your business details  ← edit this
js/main.js          Animations, calculator, load feed, form
assets/img/         Logos, badge, social share image
assets/icons/       Favicons and app icons
```

## Brand

- Colors: Charcoal `#252830`, Road Gray `#D3D4D6`, Mist `#F5F6F8`, Signal Amber `#F5A623`, Deep Slate `#3B4252`
- Fonts: Barlow Condensed (headlines) and Inter (body), loaded from Google Fonts
- Logos are the supplied files and are used unmodified.
