# Comrade — Personal Brand Portfolio

A simple, dependency-free multi-page portfolio. Plain HTML, CSS, and a small shared JavaScript file. Deployed to GitHub Pages at **https://comradeonboard.github.io**.

## Pages

| File | URL |
| --- | --- |
| `index.html` | `/` — home |
| `about.html` | `/about.html` |
| `work.html` | `/work.html` |
| `skills.html` | `/skills.html` |
| `insights.html` | `/insights.html` |
| `connect.html` | `/connect.html` — all social/contact links |
| `project-comrade-labs.html` | `/project-comrade-labs.html` |
| `project-tech-content.html` | `/project-tech-content.html` |
| `project-featured-insights.html` | `/project-featured-insights.html` |

## Editing

- Copy/styling lives in `styles.css`.
- Shared behavior (mobile nav, active link, 3D tilt, copy button, footer year) lives in `script.js`.
- Every page shares the same header and footer markup. When adding a page, copy an existing one and update `<title>`, `data-page`, and the nav.
- `data-page` values: `home`, `about`, `work`, `skills`, `insights`, `connect`. Project pages use `work` so the Work nav item stays highlighted.

## 3D animation

The hero contains a CSS 3D cube with six faces that rotates continuously. On desktop it tilts gently toward the pointer. Cards tilt slightly on hover. All motion is disabled for visitors using `prefers-reduced-motion`. No libraries or build step.

## Links

Most profiles use the username `comradeonboard`; X uses `comradeweb3`. Discord has no stable profile URL from a username, so the Connect page offers a copy button instead.

## Deploy

Push to `main` in `comradeonboard/comradeonboard.github.io` with Pages set to "Deploy from a branch" → `main` / `/ (root)`.
