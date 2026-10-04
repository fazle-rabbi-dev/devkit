# AGENTS.md — DevKit (Electron dev swiss-army-knife)

## What this is
A local-first Electron desktop app ("DevKit") with 13 tools: JSON formatter, password hashing,
Lorem Ipsum, word counter, text formatter, encoding/decoding, AES encrypt/decrypt, digital
signatures, image→PNG, plus 4 Gemini-AI tools (grammar, Banglish→Bangla, commit writer, PR writer).

## Stack & constraints
- **No build step, no framework.** Plain HTML/CSS/JS only.
- CDNs allowed: Lucide (`unpkg`), Google Fonts, Gemini SDK (`esm.run` with `esm.sh` fallback,
  loaded via dynamic `import()` in `js/ai.js` — never add it to package.json).
- `sharp` is a devDependency used **only** to rasterize `assets/icon.svg` → `assets/icon.png`.
- Run with `npm run start`. Verify JS with `node --check <file>` (no test suite).
- Packaging (exception to no-npm rule): `electron-builder` + `png-to-ico` are devDependencies
  for generating the Windows installer only — never `require()` them from app code.
  - `npm run dist` → regenerates `assets/icon.ico`, builds `dist/DevKit Setup <version>.exe`
    (NSIS, per-user, install-dir selectable). First run downloads Electron + NSIS tooling (~150MB).
  - `npm run dist:dir` → fast unpacked build in `dist/win-unpacked/` to validate packaging.
  - `npm run make-icon` → rebuilds `assets/icon.ico` from `assets/icon.png` (via `scripts/`).
  - Build config lives in the `build` key of `package.json` (appId, files allowlist, win icon).

## File map
- `index.html` — app shell: sidebar nav, topbar (search, zoom, settings gear, theme switch),
  one `<section class="tool-panel">` per tool, settings modal, `<script>` tags (order matters).
- `main.js` — Electron main process: 1280×860 window, menu bar removed
  (`autoHideMenuBar` + `win.setMenu(null)`), icon at `assets/icon.png`.
- `styles.css` — all styling. Theming via `html[data-theme]` (`light`, `dark`, `mono-light`,
  `mono-dark`) and `html[data-font]` (`atkinson`, `jetbrains`, `dmsans`, `playfair`, `fira`).
- `js/utils.js` — shared helpers on `window.DevTools.utils` (`$`, `toast`, `copy`, `download`,
  base64/hex). Use these; don't duplicate them.
- `js/ai.js` — Gemini core (`window.DevTools.ai.generate`) + settings modal (`initAi`).
- `js/app.js` — shell: nav routing, search filter, theme/zoom/font-size state, tool init calls.
- `js/tools/*.js` — one file per tool, each exposing `window.DevTools.initX()`.
- `assets/` — `icon.svg` (layered master) + `icon.png` (512px, used by Electron/taskbar).

## Adding a new tool (follow this exactly)
1. Sidebar: `<button class="nav-item" data-tool="my-tool">…</button>` (add `ai-tool` class too
   if it's an AI tool). Keep AI tools grouped consecutively under the `AI POWERED` label.
2. Panel: `<section id="tool-my-tool" class="tool-panel">…</section>` in `<main>`.
3. Logic: `js/tools/my-tool.js` with `window.DevTools.initMyTool()` (classic script, no modules).
4. Register: append `'initMyTool'` to the `inits` array in `js/app.js` + add the `<script>` tag
   before `app.js` in `index.html`.
5. Re-run `lucide.createIcons()` if you inject icons dynamically (static icons are handled).

## Rules that bite
- **CSP lives in `index.html`.** Any new CDN (script host or API endpoint) must be added to
  `script-src`/`connect-src` or it will silently fail. Font hosts are already covered.
- **Zoom:** page zoom uses `body.style.zoom` + `--zoom` var on `<html>`. `#app` height must stay
  `calc(100vh / var(--zoom, 1))` — plain `100vh` breaks under zoom (gap when zoomed out,
  whole-body scroll when zoomed in).
- **Font scaling:** all `font-size`s are in `rem` off `html { font-size: 14px }`. Never use px for
  font sizes (breaks the text-size setting); layout/padding stays in px intentionally.
- **Sidebar:** `#nav` scrollbar is deliberately hidden (`scrollbar-width: none` + webkit rule).
  Keep total sidebar content compact enough to fit short windows.
- **Secrets:** Gemini key/model live only in localStorage (`devkit-gemini-key`,
  `devkit-gemini-model`). Never hardcode keys. Other keys: `devkit-theme`, `devkit-zoom`,
  `devkit-font`, `devkit-font-size`.
- **Crypto:** use WebCrypto (`crypto.subtle`), no new dependencies.
- Keep the UI monochrome-safe: any color-coded meaning (ok/err/warn) must also work when all
  accents collapse to black/white (see the `[data-theme^="mono"]` rules).
