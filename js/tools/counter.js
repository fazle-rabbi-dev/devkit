/* Word / char counter */
window.DevTools.initCounter = function () {
  const { $ } = window.DevTools.utils;
  const inp = $('counter-input');
  inp.addEventListener('input', () => {
    const t = inp.value;
    $('c-chars').textContent = t.length;
    $('c-noSpaces').textContent = t.replace(/\s/g, '').length;
    const words = t.trim() ? t.trim().split(/\s+/) : [];
    $('c-words').textContent = t.trim() ? words.length : 0;
    $('c-sent').textContent = (t.match(/[^.!?]+[.!?]+/g) || []).length;
    $('c-para').textContent = t.trim() ? t.split(/\n\s*\n|\n/).filter(x => x.trim()).length : 0;
    const mins = words.length / 200; $('c-read').textContent = mins < 1 ? Math.round(mins * 60) + 's' : mins.toFixed(1) + 'm';
  });
  $('counter-copy').onclick = () => window.DevTools.utils.copy(inp.value);
  $('counter-clear').onclick = () => { inp.value = ''; inp.dispatchEvent(new Event('input')); };
};
