# Omugwo — Landing Page

## Project Structure

```
omugwo/
├── index.html          ← Main homepage (all sections)
├── css/
│   └── style.css       ← Full design system + all component styles
├── js/
│   └── main.js         ← Scroll animations, FAQ, nav, counters
├── assets/
│   └── logo.svg        ← Placeholder logo (replace with final)
└── images/             ← Drop your images here (see placeholders below)
```

## Image Placeholders to Replace

All image placeholders are clearly marked in the HTML. Replace in this order:

| Section | What to use | File suggestion |
|---|---|---|
| Hero (right column) | Mother holding newborn, warm lighting | `images/hero-mother.jpg` |
| Problem (top) | Mother with newborn, intimate | `images/problem-main.jpg` |
| Problem (bottom) | Caregiver with baby | `images/problem-secondary.jpg` |
| Services — Featured | Caregiver bathing newborn | `images/service-newborn.jpg` |
| Services — Mother Support | Mother breastfeeding | `images/service-mother.jpg` |
| Services — Night Care | Night scene, calm nursery | `images/service-night.jpg` |
| Trust (tall) | Caregiver portrait | `images/trust-caregiver.jpg` |
| Trust (wide) | Mother resting | `images/trust-mother.jpg` |

## To use an image, replace the placeholder div like this:

```html
<!-- BEFORE (placeholder) -->
<div class="hero__img img-placeholder" style="...">...</div>

<!-- AFTER (real image) -->
<img class="hero__img" src="images/hero-mother.jpg" alt="A mother holding her newborn at home" loading="lazy" />
```

## Content to Update

- [ ] Email address in footer: `hello@omugwo.com`
- [ ] Phone number in footer
- [ ] Stats sources (currently placeholder links)
- [ ] Social media links (Instagram, Twitter, Facebook)
- [ ] Copyright year and entity name

## Pages Still to Build

- [ ] About Us page (`about.html`)
- [ ] Services page (`services.html`)
- [ ] Contact Us page (`contact.html`)
- [ ] Caregiver signup page (`become-a-caregiver.html`)
- [ ] Waitlist / Get Started page (`waitlist.html`)

## Fonts Used

- **Fraunces** — Display/headings (Google Fonts)
- **DM Sans** — Body text (Google Fonts)

Both load from Google Fonts CDN in the HTML head.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
No build tools required — open `index.html` directly in a browser.
