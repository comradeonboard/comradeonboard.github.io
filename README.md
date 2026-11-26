# Comrade: Personal Brand Portfolio

A clean dark-mode multi-page portfolio built with plain HTML, CSS, and a small shared JavaScript file. It includes a live 3D background and a dedicated repos page for proof of work. Deployed at **https://comradeonboard.github.io**.

## Pages

| File | URL |
| --- | --- |
| `index.html` | `/` (home) |
| `about.html` | `/about.html` |
| `work.html` | `/work.html` |
| `skills.html` | `/skills.html` |
| `insights.html` | `/insights.html` |
| `connect.html` | `/connect.html` (all social/contact links) |
| `project-comrade-labs.html` | `/project-comrade-labs.html` |
| `project-tech-content.html` | `/project-tech-content.html` |
| `project-featured-insights.html` | `/project-featured-insights.html` |

## Editing

- Copy/styling lives in `styles.css`.
- Shared behavior (mobile nav, active link, background 3D, card tilt, copy button, footer year) lives in `script.js`.
- Every page shares the same header and footer markup. When adding a page, copy an existing one and update `<title>`, `data-page`, and the nav.
- `data-page` values: `home`, `about`, `work`, `skills`, `insights`, `connect`. Project pages use `work` so the Work nav item stays highlighted.

## Theme and 3D animation

The site is dark mode only. A live Three.js wireframe globe and particle field sit behind every page, reacting slowly to pointer movement. If WebGL or the CDN is unavailable, a CSS gradient animation takes over. Cards tilt slightly on hover. All motion is disabled for visitors using `prefers-reduced-motion`. No build step is required.

## Proof of work

The Work page has a repository section with selected public GitHub projects and a link to the full profile. Edit the cards in `work.html` to change which repos are featured.

## Links

Most profiles use the username `comradeonboard`; X uses `comradeweb3`. Discord has no stable profile URL from a username, so the Connect page offers a copy button instead. The Connect page also includes GitHub Gists, Instagram, Snapchat, TikTok and KICK profiles found via public search.

## Deploy

### GitHub Pages

Push to `main` in `comradeonboard/comradeonboard.github.io` with Pages set to "Deploy from a branch" → `main` / `/ (root)`. Site URL: https://comradeonboard.github.io/

### Render Web Service

The repo includes `render.yaml` and `server.py`. Start command:

```
python3 server.py
```

The server listens on the `PORT` environment variable that Render provides, defaulting to `10000` locally. Two ways to deploy:

1. In Render, create a new Web Service, connect `comradeonboard/comradeonboard.github.io`, and set the start command to `python3 server.py`. Runtime is Python 3.
2. Or use the included Blueprint: Render Dashboard → New → Blueprint → point it at this repo. `render.yaml` sets everything up automatically.

No Python packages are needed. The server uses the standard library only.
