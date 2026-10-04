/* Text case formatter */
window.DevTools.initTextcase = function () {
  const { $, copy } = window.DevTools.utils;
  const inp = $('tc-input');
  const F = {
    upper: s => s.toUpperCase(), lower: s => s.toLowerCase(),
    title: s => s.toLowerCase().replace(/(?:^|\s|[("'-])\S/g, c => c.toUpperCase()),
    sentence: s => s.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, c => c.toUpperCase()),
    camel: s => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase()),
    snake: s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    kebab: s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    slug: s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    alternating: s => [...s].map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join(''),
    inverse: s => [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    trim: s => s.split('\n').map(l => l.trim()).join('\n'),
    spaces: s => s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(),
    reverse: s => [...s].reverse().join(''),
    removeEmpty: s => s.split('\n').filter(l => l.trim()).join('\n'),
  };
  document.querySelectorAll('[data-tc]').forEach(b => b.onclick = () => { inp.value = F[b.dataset.tc](inp.value); });
  $('tc-copy').onclick = () => copy(inp.value);
  $('tc-clear').onclick = () => inp.value = '';
};
