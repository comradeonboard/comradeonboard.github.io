# Comrade: Personal Brand Portfolio

A clean dark-mode multi-page portfolio built with plain HTML, CSS, and a small shared JavaScript file. It has a live 3D background, a GitHub proof of work section, and layouts that adapt to phones, iPads and desktops.

Live site: https://comradeonboard.github.io/

## Pages

| File | URL |
| --- | --- |
| `index.html` | `/` (home) |
| `about.html` | `/about.html` |
| `work.html` | `/work.html` (projects plus GitHub proof of work) |
| `skills.html` | `/skills.html` |
| `insights.html` | `/insights.html` |
| `connect.html` | `/connect.html` (all social and contact links) |
| `project-comrade-labs.html` | `/project-comrade-labs.html` |
| `project-tech-content.html` | `/project-tech-content.html` |
| `project-featured-insights.html` | `/project-featured-insights.html` |

## Editing

- Styling lives in `styles.css`.
- Shared behavior lives in `script.js`: active navigation link, background 3D scene, card tilt, Discord username copy button and footer year.
- Every page shares the same header and footer markup. When adding a page, copy an existing one and update `<title>`, `data-page`, and the navigation.
- `data-page` values: `home`, `about`, `work`, `skills`, `insights`, `connect`. Project detail pages use `work` so the Work nav item stays highlighted.
- All pages include a no-cache meta tag so visitors get the latest version after updates.

## Corrections applied

- Removed the contact CTA from the navigation.
- Removed every em dash and en dash from the site.
- Removed the old terminal-style tagline and the old biography heading block.
- Removed the unwanted third service card, skill, insight quote and related copy.
- Removed the light/dark theme button. The site is dark mode only.
- Removed the menu button. Navigation is now a horizontal scrollable bar on smaller screens.
- Removed the page photo from the home and about pages.
- Set a circular version of your photo (`media/favicon.png`) as the favicon on every page.

## Theme and 3D animation

The site is dark mode only. A live Three.js wireframe globe and particle field sit behind every page and react slowly to pointer movement. If WebGL or the CDN is unavailable, a CSS gradient animation takes over. Cards tilt slightly on hover. All motion is disabled for visitors using `prefers-reduced-motion`. No build step is required.

## Responsive behavior

- Above 1024px: full horizontal navigation and wide layouts.
- At 1024px and below: header stacks, navigation becomes a horizontally scrollable bar, no buttons needed.
- At 900px and below: two-column content grids and stacked section headings.
- At 720px and below: single-column cards, links, skills and repository grid.
- At 480px and below: tighter spacing, smaller type, full-width buttons.
- Short landscape screens get reduced vertical padding.

## Proof of work

The Work page has a repository section with selected public GitHub projects and a link to the full profile. Edit the cards in `work.html` to change which repositories are featured.

## Visitor counter

Every page loads a hidden tracking pixel from `visitor-badge.laobi.icu` with the page id `comradeonboard.site`. The same badge is shown in the GitHub profile README at `comradeonboard/comradeonboard`. Every visit to this site increments the count shown on GitHub. The counter is external, so no backend or database is needed.

## Links

Most profiles use the username `comradeonboard`; X uses `comradeweb3`. Discord has no stable profile URL from a username, so the Connect page offers a copy button instead. The Connect page also includes GitHub Gists, Instagram, Snapchat, TikTok and KICK profiles found through public search.

## Deploy

### GitHub Pages

Push to `main` in `comradeonboard/comradeonboard.github.io` with Pages set to "Deploy from a branch" → `main` / `/ (root)`. Site URL: https://comradeonboard.github.io/

### Render Web Service

**If creating a Web Service manually**, set these two fields in the Render dashboard:

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python3 server.py`

The repo includes `requirements.txt` (installs gunicorn), `server.py` (Python standard-library server), `app.py` and `your_application/wsgi.py` (gunicorn fallbacks).

**If the Start Command is left empty**, Render may default to `gunicorn app:app` or `gunicorn your_application.wsgi`. Both work: `app.py` and `your_application/wsgi.py` serve the same static files, and `requirements.txt` installs gunicorn so either command is available.

**Alternatively**, use the included Blueprint: Render Dashboard → **New** → **Blueprint** → point it at this repo. `render.yaml` sets the build and start commands automatically.

`server.py` listens on the `PORT` environment variable Render provides and falls back to `10000` locally.
