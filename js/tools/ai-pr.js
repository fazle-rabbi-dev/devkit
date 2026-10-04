/* AI: pull request title + description writer. */
window.DevTools.initAiPr = function () {
  const { $, copy, status } = window.DevTools.utils;
  const run = async () => {
    const desc = $('pr-input').value.trim();
    if (!desc) return status($('pr-status'), 'Describe the work first.', false);
    const ctx = $('pr-context').value.trim();
    const btn = $('pr-go'); btn.disabled = true;
    status($('pr-status'), 'Writing PR…', null);
    try {
      const out = await window.DevTools.ai.generate(
        'You are an expert at writing pull request descriptions. Based on the work below, write a PR title on the first line, ' +
        'then a blank line, then a markdown description with exactly these sections: ## Summary, ## Changes, ## Testing. ' +
        'No intro, no outro, no extra commentary.\n\nWork done:\n' + desc +
        (ctx ? '\n\nExtra context:\n' + ctx : ''));
      $('pr-output').value = out.trim();
      status($('pr-status'), '✓ Done.', true);
    } catch (e) { status($('pr-status'), '✕ ' + e.message, false); }
    btn.disabled = false;
  };
  $('pr-go').onclick = run;
  $('pr-copy').onclick = () => copy($('pr-output').value);
  $('pr-clear').onclick = () => { $('pr-input').value = ''; $('pr-context').value = ''; $('pr-output').value = ''; status($('pr-status'), '', null); };
  [$('pr-input'), $('pr-context')].forEach(el => el.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  }));
};
