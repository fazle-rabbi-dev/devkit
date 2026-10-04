/* JSON formatter + tree viewer */
window.DevTools.initJson = function () {
  const { $, toast, status } = window.DevTools.utils;
  const input = $('json-input'), tree = $('json-tree'), st = $('json-status'), meta = $('json-meta');
  const indentSel = $('json-indent');
  const getIndent = () => indentSel.value === 'tab' ? '\t' : ' '.repeat(+indentSel.value);

  function renderTree(val) {
    tree.classList.remove('empty'); tree.innerHTML = '';
    tree.appendChild(nodeEl('root', val));
    meta.textContent = `· ${countNodes(val)} nodes`;
    tree.querySelectorAll('.t-toggle').forEach(t => t.onclick = () => t.parentElement.querySelector('.t-children').toggleAttribute('hidden') && 0 || t.parentElement.querySelector('.t-children').toggleAttribute('hidden'));
    if (window.lucide) lucide.createIcons();
  }
  // simpler toggle: click toggles hidden
  tree.addEventListener('click', e => {
    if (e.target.classList.contains('t-toggle')) {
      const ch = e.target.parentElement.querySelector('.t-children');
      if (ch) { ch.hidden = !ch.hidden; e.target.textContent = ch.hidden ? '▸' : '▾'; }
    }
  });
  function countNodes(v) { if (Array.isArray(v)) return v.reduce((a, x) => a + countNodes(x), 1); if (v && typeof v === 'object') return Object.values(v).reduce((a, x) => a + countNodes(x), 1); return 1; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function nodeEl(key, val) {
    const wrap = document.createElement('div'); wrap.className = 't-node';
    if (val !== null && typeof val === 'object') {
      const isArr = Array.isArray(val), keys = Object.keys(val);
      wrap.innerHTML = `<span class="t-toggle">▾</span> <span class="t-key">${esc(key)}</span>: <span class="muted">${isArr ? `Array(${keys.length})` : `Object{${keys.length}}`}</span><div class="t-children"></div>`;
      const ch = wrap.querySelector('.t-children');
      keys.forEach(k => ch.appendChild(nodeEl(isArr ? `[${k}]` : k, val[k])));
    } else {
      const cls = typeof val === 'string' ? 't-str' : typeof val === 'number' ? 't-num' : 't-key';
      const disp = typeof val === 'string' ? `"${esc(val)}"` : esc(JSON.stringify(val));
      wrap.innerHTML = `<span class="t-key">${esc(key)}</span>: <span class="${cls}">${disp}</span>`;
    }
    return wrap;
  }
  function parse() { const raw = input.value.trim(); if (!raw) throw new Error('Input is empty'); return JSON.parse(raw); }

  $('json-format').onclick = () => { try { const o = parse(); input.value = JSON.stringify(o, null, getIndent()); renderTree(o); status(st, '✓ Valid JSON, formatted.', true); } catch (e) { status(st, '✕ ' + e.message, false); } };
  $('json-minify').onclick = () => { try { const o = parse(); input.value = JSON.stringify(o); renderTree(o); status(st, 'Minified.', true); } catch (e) { status(st, '✕ ' + e.message, false); } };
  $('json-validate').onclick = () => { try { const o = parse(); renderTree(o); status(st, '✓ Valid JSON.', true); } catch (e) { status(st, '✕ Invalid: ' + e.message, false); } };
  $('json-sample').onclick = () => { input.value = JSON.stringify({ name: 'DevKit', version: 1, active: true, tags: ['json', 'tools'], meta: { author: 'you', nested: { a: 1 } } }, null, 2); $('json-format').click(); };
  $('json-copy').onclick = () => window.DevTools.utils.copy(input.value);
  $('json-clear').onclick = () => { input.value = ''; tree.innerHTML = 'Nothing to show yet.'; tree.classList.add('empty'); meta.textContent = ''; status(st, '', null); };
};
