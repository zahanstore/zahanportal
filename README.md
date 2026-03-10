# Zahan Store® — World Portal

> **"Designed in the desert, made for the world."**  
> The official world portal for Zahan Store® — a fashion, lifestyle, art & digital products brand founded in Abu Dhabi, UAE (Est. 1996).

🌐 **Live site:** [www.zahan.one](https://www.zahan.one)  
🇮🇳 **India store:** [shop.zahan.one](https://shop.zahan.one) (Payhip-Native)  
🌍 **International store:** [store.zahan.one](https://store.zahan.one) (Fourthwall-Native)

---

## Pages

| File | Route | Description |
|------|-------|-------------|
| `index.html` | `/` | Homepage — hero, about, manifesto, features, testimonials, contact overview |
| `zahan-universe.html` | `/zahan-universe` | The Zahan® Universe™ — GenX, Signature & Heritage brand chapters |
| `faqs.html` | `/faqs` | Master FAQ — accordion, 5 categories, sticky tab nav |
| `contact.html` | `/contact` | Contact page — 4 routed email channels + Supabase form |
| `privacy-policy.html` | `/privacy-policy` | Privacy Policy |
| `terms-and-conditions.html` | `/terms-and-conditions` | Terms & Conditions |
| `return-and-refund.html` | `/return-and-refund` | Return & Refund Policy |
| `shipping-and-delivery.html` | `/shipping-and-delivery` | Shipping & Delivery Policy |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Hosting | Vercel (auto-deploy from `main` branch) |
| Frontend | Vanilla HTML + CSS + JS — zero build step |
| Stylesheet | Single shared `style.css` across all pages |
| Scripts | Single shared `script.js` across all pages |
| Database | Supabase (contact form submissions) |
| Fonts | Google Fonts — Quicksand (headings) + Inter (body) |
| Icons | Font Awesome 6 CDN |
| Analytics | — |

---

## Design System

### Colors

```css
/* Dark mode (default) */
--bg:         #0b0d17
--surface:    #131726
--card:       #1a1f33
--accent:     #5b8dee   /* primary blue */
--accent2:    #a78bfa   /* violet */
--grad:       linear-gradient(135deg, #5b8dee 0%, #a78bfa 100%)
--text:       #eef0f8
--text-muted: #7c859e

/* Light mode */
--bg:         #e8ecf5
--surface:    #edf0f8
--card:       #f2f5fc
--text:       #1a1e2e
--text-muted: #5a6280
```

### Typography

```css
--font-head: 'Quicksand', sans-serif   /* weight 700 — all headings, nav, buttons */
--font-body: 'Inter', sans-serif       /* weight 300–500 — body copy */
```

### Hero Gradient Text
The `.grad-text` class inside `.gateway-section` uses a 3-stop gradient:
```css
background: linear-gradient(135deg, #60c0ff 0%, #a78bfa 55%, #e879f9 100%);
```
**Important:** Always set `text-shadow: none` on `.grad-text` spans — inherited text-shadows blacken background-clip text in all browsers.

---

## File Structure

```
zahanstore/zahan-vercel/
│
├── index.html
├── zahan-universe.html
├── faqs.html
├── contact.html
├── privacy-policy.html
├── terms-and-conditions.html
├── return-and-refund.html
├── shipping-and-delivery.html
│
├── style.css              ← single shared stylesheet
├── script.js              ← single shared JS
│
├── images/
│   ├── brand/
│   │   ├── logo.png       ← nav logo
│   │   └── favicon.png    ← browser tab icon
│   ├── hero/
│   │   └── hero.jpg       ← homepage hero background
│   └── about/
│       └── about.jpg      ← about section image
│
├── SUPABASE_SETUP.md      ← Supabase config & SQL guide
├── IMAGES_STRUCTURE.md    ← image folder conventions
└── README.md
```

> **Images note:** All image references in `style.css` and HTML files use paths relative to root (e.g. `images/hero/hero.jpg`). See `IMAGES_STRUCTURE.md` for full naming conventions.

---

## Shared Components

Every page uses **identical** nav and footer. When updating either, update **all** pages.

### Nav links (in order)
Home → Shop Now (dropdown: India, International) → About Us → Manifesto → Features → Contact

### Footer columns (in order)
Online Stores → Collections → Company → Follow Us

### Company footer links
Zahan Universe · Features · FAQ's · About Us · Contact Us · Privacy Policy · Terms of Service · Return & Refund · Shipping & Delivery

---

## Dark / Light Mode

- Toggled by adding/removing `body.light-mode` class
- Preference saved to `localStorage` key `zs-theme`
- Toggle button: `.mode-toggle` in `.nav-tools` (desktop) + `.mobile-tools` (mobile)
- All color variables are redefined under `body.light-mode` in `style.css`

---

## Contact Form — Supabase

The contact form (`contact.html`) writes to Supabase table `contact_messages`.

### Department routing

| Select value | Routes to |
|---|---|
| `support` | support@mail.zahan.one — delivery, refunds, returns |
| `store` | store@mail.zahan.one — brand feedback, suggestions |
| `legal` | legal@mail.zahan.one — policy, data rights |
| `hr` | hr@mail.zahan.one — careers, joining the team |

### Setup
See `SUPABASE_SETUP.md` for full SQL and credential setup.  
Replace these two placeholders in `contact.html`:
```js
const SUPABASE_URL  = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';
```

---

## Zahan® Universe™ — Brand Architecture

Three sub-brands, all housed under `zahan-universe.html`:

| Brand | Tagline | Vibe | Accent |
|-------|---------|------|--------|
| Zahan® GenX™ | Bold has a new feeling, style without limits | Conscious, energetic & Accessible | `#60c0ff` |
| Zahan® Signature™ | Calm Cut, Sharp Presence | Refined, balanced & Intentional | `#a78bfa` |
| Zahan® Heritage™ | A Heritage in Every Thread | Timeless, Artisanal & Craftsmanship | `#e879f9` |

---

## Deployment

This repo auto-deploys to Vercel on every push to `main`.

- No build step — static files served directly
- Custom domain: `zahan.one` pointed to Vercel
- Sub-domains (`shop.`, `store.`) are external (Payhip & Fourthwall) — not in this repo

---

## Maintenance Notes

- **Adding a new page?** Copy nav + footer from any existing page. Link it in the footer Company column across all pages.
- **Changing brand colors?** Update CSS variables at the top of `style.css` — everything inherits from them.
- **Changing fonts?** Update the Google Fonts `<link>` in each page `<head>` and the `--font-head` / `--font-body` variables in `style.css`.
- **Nav change?** Ctrl+F for `nav-links` — update in every `.html` file.
- **Hero text-shadow rule:** Never add `filter: drop-shadow()` or inherited `text-shadow` to `.grad-text` spans — it blackens gradient-clip text across browsers. Use a scrim/backdrop element instead.

---

## Brand Details

| | |
|---|---|
| Founded | 1996 |
| HQ | UAE, Abu Dhabi |
| Branch | Bombay, Maharashtra, India |
| Email (support) | support@mail.zahan.one |
| Email (brand) | store@mail.zahan.one |
| Email (legal) | legal@mail.zahan.one |
| Email (HR) | hr@mail.zahan.one |
| YouTube | [@ZahanStore](https://youtube.com/@ZahanStore) |
| Instagram | [@storezahan](https://instagram.com/storezahan) |

---

*Made with ♥ in Abu Dhabi, UAE*
