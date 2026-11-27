# Comrade: Personal Brand Portfolio

A clean dark-mode multi-page portfolio built with plain HTML, CSS, and a small shared JavaScript file. The visual design follows the Arafat Onimisi portfolio: Space Grotesk and Inter typography, blueprint grid backgrounds, numbered eyebrows, pill buttons and card grids. It has a GitHub proof of work section, and layouts that adapt to phones, iPads and desktops.

Live site: https://comradeonboard.github.io/

## Pages

| File | URL |
| --- | --- |
| `index.html` | `/` (home) |
| `about.html` | `/about.html` |
| `experience.html` | `/experience.html` (projects, GitHub proof of work, skills, and insights) |
| `skills.html` | `/skills.html` (legacy redirect to Experience) |
| `work.html` | `/work.html` (legacy redirect to Experience) |
| `insights.html` | `/insights.html` (legacy redirect to Experience) |
| `affiliates.html` | `/affiliates.html` (affiliate platforms and bot links) |
| `connect.html` | `/connect.html` (all social and contact links) |
| `project-comrade-labs.html` | `/project-comrade-labs.html` |
| `project-tech-content.html` | `/project-tech-content.html` |
| `project-featured-insights.html` | `/project-featured-insights.html` |
| `404.html` | Custom not-found page |

Old Work, Insights, and Skills URLs stay live as noindex redirects to Experience so existing links do not break.

## Editing

- Styling lives in `styles.css`. It is dark only, with no theme toggle. The hamburger menu is available on every screen size, including normal desktop.
- Shared behavior lives in `script.js`: sticky header state, active navigation link, menu toggle, scroll reveal, count-up stats, Discord username copy button, footer year and a live ambient 3D background.
- The 3D background is a low-opacity wireframe shape and particle field drawn on a fixed canvas behind the content. It uses the site accent color, adapts to screen size, pauses when the tab is hidden, and falls back to CSS gradients when WebGL is unavailable or reduced motion is requested.
- Every page shares the same header and footer markup. When adding a page, copy an existing one and update `<title>`, `data-page`, and the navigation.
- `data-page` values: `home`, `about`, `experience`, `affiliates`, `connect`. Project detail pages use `experience` so the Experience nav item stays highlighted.
- All pages include a no-cache meta tag so visitors get the latest version after updates.
- SEO lives in each page's `<head>`: Open Graph, Twitter card, canonical URL and JSON-LD structured data. `sitemap.xml` and `robots.txt` are in the repo root.

## Corrections applied

- Removed the contact CTA from the navigation.
- Removed every em dash and en dash from the site.
- Removed the old terminal-style tagline and the old biography heading block.
- Removed the unwanted third service card, skill, insight quote and related copy.
- Removed the light/dark theme button. The site is dark mode only.
- Kept the menu button on every screen size as a compact dropdown that does not cover the page.
- Removed the page photo from the home and about pages.
- Set a circular version of your photo (`media/favicon.png`) as the favicon on every page.

## Theme and 3D animation

The site is dark mode only. A live Three.js wireframe globe, particle field, and subtle crypto candlestick chart sit behind every page and react slowly to pointer movement. If WebGL or the CDN is unavailable, a CSS gradient animation takes over. Cards tilt slightly on hover. All motion is disabled for visitors using `prefers-reduced-motion`. No build step is required.

## Responsive behavior

- Above 1024px: full horizontal navigation, compact menu button, and wide layouts.
- At 1024px and below: header stacks and navigation opens as a compact dropdown from the menu button.
- At 900px and below: two-column content grids and stacked section headings.
- At 720px and below: single-column cards, links, skills and repository grid.
- At 480px and below: tighter spacing, smaller type, full-width buttons.
- Short landscape screens get reduced vertical padding.

## Proof of work

The Experience page has a repository section with selected public GitHub projects and a link to the full profile. Edit the cards in `experience.html` to change which repositories are featured.

## Visitor counter

Every page loads a hidden tracking pixel from `visitor-badge.laobi.icu` with the page id `comradeonboard.site`. The same badge is shown in the GitHub profile README at `comradeonboard/comradeonboard`. Every visit to this site increments the count shown on GitHub. The counter is external, so no backend or database is needed.

## Links

Most profiles use the username `comradeonboard`; X uses `comradeweb3`. Discord has no stable profile URL from a username, so the Connect page offers a copy button instead. The Connect page lists GitHub, X, LinkedIn, Telegram, WhatsApp, Email, Discord and Comrade Labs.

## Deploy

### GitHub Pages

Push to `main` in `comradeonboard/comradeonboard.github.io` with Pages set to "Deploy from a branch" → `main` / `/ (root)`. Site URL: https://comradeonboard.github.io/

### Render Web Service

The repo supports both a manually created Web Service and the included Blueprint.

`requirements.txt` installs `gunicorn`. If a Web Service is created with blank build and start commands, Render uses its defaults: `pip install -r requirements.txt` and `gunicorn app:app`. That works because `app.py` exposes a WSGI app. `your_application/wsgi.py` is also included in case the older default `gunicorn your_application.wsgi` is used. If the build command is set, it copies the site into `dist/`; the apps serve `dist/` when present, otherwise the repo root.

**Option A: Dashboard**

1. Render Dashboard → **New** → **Web Service**.
2. Connect `comradeonboard/comradeonboard.github.io`, branch `main`, root directory empty.
3. Runtime **Python 3**, plan Free.
4. Set the fields exactly:

   | Field | Value |
   | --- | --- |
   | Build Command | `mkdir -p dist && cp -r *.html *.xml *.txt media styles.css script.js dist/` |
   | Start Command | `python3 server.py` |

5. Create the Web Service. Render assigns a URL such as `https://comrade-xxxx.onrender.com`. Future pushes to `main` deploy automatically.

**Option B: Blueprint**

Render Dashboard → **New** → **Blueprint** → point it at this repo. `render.yaml` sets the service name, build command and start command automatically.

All three entry points (`python3 server.py`, `gunicorn app:app`, and `gunicorn your_application.wsgi`) read `PORT` from Render and fall back to `8000` locally. They serve the site's own `404.html` for unknown URLs and disable directory listings.

Existing manually created services keep their own settings. In Render Dashboard, open the service and check **Settings → Build & Deploy**. Either leave Build Command blank and Start Command blank so the defaults install gunicorn and run `app:app`, or set them explicitly to the values in Option A. After changing settings, use **Manual Deploy → Deploy latest commit**.

> On Render's free plan the service sleeps after inactivity, so the first visit after a gap can take several seconds. A Static Site avoids this, but this repo is configured as a Web Service as requested. If you move to a custom domain, update `og:url`, canonical links, `sitemap.xml` and `robots.txt` to the new address.
