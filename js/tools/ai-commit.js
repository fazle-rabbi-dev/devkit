/* AI: git commit message writer — 3 conventional-commit variants with descriptions. */
window.DevTools.initAiCommit = function () {
  const { $, copy, status } = window.DevTools.utils;
  const run = async () => {
    const desc = $('cm-input').value.trim();
    if (!desc) return status($('cm-status'), 'Describe what you did first.', false);
    const diff = $('cm-diff').value.trim();
    const btn = $('cm-go'); btn.disabled = true;
    status($('cm-status'), 'Writing commit messages…', null);
    $('cm-variants').innerHTML = '';
    try {
      const out = await window.DevTools.ai.generate(
        'You are an expert at writing conventional commits. Based on the changes below, write exactly 3 variants of a git commit message. ' +
        'Pick the right prefix for each variant based on the change (feat, fix, docs, style, refactor, perf, test, chore, etc.). ' +
        'Each variant: a short subject line (max 72 chars), then a blank line, then a 2-4 sentence description explaining what changed and why. ' +
        'Separate the 3 variants with a line containing only ---. No intro, no outro, no extra commentary.\n\nChanges:\n' + desc +
        (diff ? '\n\nDiff / files:\n' + diff : ''));
      const parts = out.split(/\n\s*---+\s*\n/).map(s => s.trim()).filter(Boolean);
      const variants = parts.length >= 2 ? parts.slice(0, 3) : [out.trim()];
      variants.forEach((v, i) => {
        const card = document.createElement('div');
        card.className = 'variant-card';
        const head = document.createElement('div');
        head.className = 'muted'; head.textContent = 'Variant ' + (i + 1);
        const body = document.createElement('div'); body.textContent = v;
        const row = document.createElement('div'); row.className = 'row';
        const cp = document.createElement('button'); cp.className = 'btn'; cp.textContent = 'Copy variant';
        cp.onclick = () => copy(v);
        row.appendChild(cp); card.append(head, body, row);
        $('cm-variants').appendChild(card);
      });
      status($('cm-status'), '✓ 3 variants ready.', true);
    } catch (e) { status($('cm-status'), '✕ ' + e.message, false); }
    btn.disabled = false;
  };
  $('cm-go').onclick = run;
  [$('cm-input'), $('cm-diff')].forEach(el => el.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  }));
};
