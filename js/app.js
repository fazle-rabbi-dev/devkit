/* App shell: navigation, search, theme. TO ADD A TOOL: add nav button + panel in index.html, create js/tools/x.js, call window.DevTools.initX() below. */
(function () {
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;

  function showTool(id) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tool === id));
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.toggle('active', p.id === 'tool-' + id));
    $('content').scrollTop = 0;
  }
  document.querySelectorAll('.nav-item').forEach(b => b.onclick = () => showTool(b.dataset.tool));

  // search filters nav
  $('tool-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('hidden', q && !b.textContent.toLowerCase().includes(q)));
  });

  // zoom: Ctrl/Cmd + wheel, Ctrl/Cmd + (+/-/0), persisted. Uses CSS zoom (renderer-only, no main-process change needed).
  const ZOOM_STEP = 0.1, ZOOM_MIN = 0.5, ZOOM_MAX = 2;
  let zoom = parseFloat(localStorage.getItem('devkit-zoom')) || 1;
  function applyZoom() {
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom * 10) / 10));
    document.body.style.zoom = zoom;
    root.style.setProperty('--zoom', zoom); // keeps 100vh shell math correct under CSS zoom
    const lbl = $('zoom-label');
    if (lbl) lbl.textContent = Math.round(zoom * 100) + '%';
    try { localStorage.setItem('devkit-zoom', zoom); } catch {}
  }
  window.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoom += ZOOM_STEP; applyZoom(); }
    else if (e.key === '-') { e.preventDefault(); zoom -= ZOOM_STEP; applyZoom(); }
    else if (e.key === '0') { e.preventDefault(); zoom = 1; applyZoom(); }
  });
  window.addEventListener('wheel', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    zoom += (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
    applyZoom();
  }, { passive: false });
  if ($('zoom-in')) $('zoom-in').onclick = () => { zoom += ZOOM_STEP; applyZoom(); };
  if ($('zoom-out')) $('zoom-out').onclick = () => { zoom -= ZOOM_STEP; applyZoom(); };
  if ($('zoom-label')) $('zoom-label').onclick = () => { zoom = 1; applyZoom(); };
  applyZoom();

  // display: font family (5 choices) + app text size, persisted
  const FONTS = ['atkinson', 'jetbrains', 'dmsans', 'playfair', 'fira'];
  function applyFont(f) {
    if (!FONTS.includes(f)) f = 'atkinson';
    root.dataset.font = f;
    try { localStorage.setItem('devkit-font', f); } catch {}
    const sel = $('ui-font');
    if (sel) sel.value = f;
  }
  const FS_MIN = 0.85, FS_MAX = 1.3, FS_STEP = 0.05, FS_BASE = 14;
  let fontScale = parseFloat(localStorage.getItem('devkit-font-size')) || 1;
  function applyFontSize() {
    fontScale = Math.min(FS_MAX, Math.max(FS_MIN, Math.round(fontScale * 100) / 100));
    root.style.fontSize = (Math.round(FS_BASE * fontScale * 100) / 100) + 'px';
    const lbl = $('font-size-label');
    if (lbl) lbl.textContent = Math.round(fontScale * 100) + '%';
    try { localStorage.setItem('devkit-font-size', fontScale); } catch {}
  }
  if ($('ui-font')) $('ui-font').onchange = e => applyFont(e.target.value);
  if ($('font-inc')) $('font-inc').onclick = () => { fontScale += FS_STEP; applyFontSize(); };
  if ($('font-dec')) $('font-dec').onclick = () => { fontScale -= FS_STEP; applyFontSize(); };
  if ($('font-size-label')) $('font-size-label').onclick = () => { fontScale = 1; applyFontSize(); };
  let savedFont = null;
  try { savedFont = localStorage.getItem('devkit-font'); } catch {}
  applyFont(savedFont || 'atkinson');
  applyFontSize();

  // themes: color light/dark + mono light/dark, persisted
  const VALID_THEMES = ['light', 'dark', 'mono-light', 'mono-dark'];
  function setTheme(t) {
    if (!VALID_THEMES.includes(t)) t = 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('devkit-theme', t); } catch {}
    document.querySelectorAll('[data-set-theme]').forEach(b => b.classList.toggle('active', b.dataset.setTheme === t));
  }
  document.querySelectorAll('[data-set-theme]').forEach(b => b.onclick = () => setTheme(b.dataset.setTheme));
  let saved = null;
  try { saved = localStorage.getItem('devkit-theme'); } catch {}
  if (saved === 'mono') saved = 'mono-light'; // migrate old single mono theme
  setTheme(saved || 'dark');

  // init all tools (each file is independent → scalable)
  const inits = ['initJson', 'initPassword', 'initLorem', 'initCounter', 'initTextcase', 'initEncoding', 'initEncrypt', 'initSignature', 'initImage', 'initAi', 'initAiGrammar', 'initAiBanglish', 'initAiCommit', 'initAiPr'];
  inits.forEach(fn => { try { window.DevTools[fn] && window.DevTools[fn](); } catch (e) { console.error(fn, e); } });

  if (window.lucide) lucide.createIcons();
})();
