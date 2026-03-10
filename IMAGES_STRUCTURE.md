# Images Folder Structure
## Zahan Store — zahanstore/zahan-vercel

Move all image files into this structure in your GitHub repo.
Update all `src=""` references accordingly.

---

## Recommended Structure

```
/images/
│
├── brand/
│   ├── logo.png              ← Main nav logo (currently: logo.png)
│   └── favicon.png           ← Browser tab icon (currently: favicon.png)
│
├── hero/
│   └── hero.jpg              ← Homepage hero background (currently: hero.jpg)
│
├── about/
│   └── about.jpg             ← About section image on homepage
│
└── og/
    └── og-cover.jpg          ← Open Graph share image (add this later)
```

---

## File Path Changes After Moving

Update these `src` / `href` references across ALL HTML files:

| Old path       | New path               | Used in                        |
|----------------|------------------------|--------------------------------|
| `logo.png`     | `images/brand/logo.png`| All pages — nav `<img>`        |
| `favicon.png`  | `images/brand/favicon.png` | All pages — `<link rel="icon">` |
| `hero.jpg`     | `images/hero/hero.jpg` | `style.css` — gateway-section  |
| `about.jpg`    | `images/about/about.jpg` | `index.html` — about section  |

---

## How to Update in style.css

Find the hero background line and update:

```css
/* Before */
background: ... url('hero.jpg') center/cover no-repeat;

/* After */
background: ... url('images/hero/hero.jpg') center/cover no-repeat;
```

---

## How to Bulk Update HTML Files

Use GitHub's search & replace, or run this in your terminal (if you clone locally):

```bash
# macOS/Linux — replace logo.png reference in all HTML
sed -i '' 's|src="logo.png"|src="images/brand/logo.png"|g' *.html

# Replace favicon
sed -i '' 's|href="favicon.png"|href="images/brand/favicon.png"|g' *.html
```

---

## Future Image Additions

When you add more images (product photos, team photos, etc.), use:

```
/images/
├── collections/
│   ├── genx/
│   ├── signature/
│   └── heritage/
├── team/
└── blog/         ← if you add a blog later
```

---

## Naming Conventions

- All lowercase, hyphens not spaces: `hero-banner.jpg` ✅ not `Hero Banner.jpg` ❌
- Include dimensions in name for variants: `logo-2x.png` for retina
- Use `.webp` format for new images (50% smaller than jpg, same quality)
