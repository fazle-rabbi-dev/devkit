/* AI: grammar fixer (Ctrl+Enter to run) */
window.DevTools.initAiGrammar = function () {
  const { $, copy, status } = window.DevTools.utils;
  const run = async () => {
    const text = $('gr-input').value.trim();
    if (!text) return status($('gr-status'), 'Paste some text first.', false);
    const btn = $('gr-fix'); btn.disabled = true;
    status($('gr-status'), 'Fixing grammar…', null);
    try {
      const out = await window.DevTools.ai.generate(
        'You are a grammar correction tool. Fix grammar, spelling, and punctuation in the text below. ' +
        'Preserve the original meaning, tone, and language. Return ONLY the corrected text — no explanations, no quotes.\n\n---\n' + text);
      $('gr-output').value = out.trim();
      status($('gr-status'), '✓ Done.', true);
    } catch (e) { status($('gr-status'), '✕ ' + e.message, false); }
    btn.disabled = false;
  };
  $('gr-fix').onclick = run;
  $('gr-copy').onclick = () => copy($('gr-output').value);
  $('gr-clear').onclick = () => { $('gr-input').value = ''; $('gr-output').value = ''; status($('gr-status'), '', null); };
  $('gr-input').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  });
};
