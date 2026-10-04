/* AI: Banglish (phonetic Bengali in Latin script) → Bangla script.
   Technical terms / brand names stay in English for readability. */
window.DevTools.initAiBanglish = function () {
  const { $, copy, status } = window.DevTools.utils;
  const run = async () => {
    const text = $('bl-input').value.trim();
    if (!text) return status($('bl-status'), 'Write some Banglish first.', false);
    const btn = $('bl-convert'); btn.disabled = true;
    status($('bl-status'), 'Converting…', null);
    try {
      const out = await window.DevTools.ai.generate(
        'Convert the Banglish text below (Bengali written phonetically with English letters) into proper Bengali script (Bangla). ' +
        'IMPORTANT: keep technical terms, product and brand names, and common tech words (such as technology, AI, terminal, GitHub, Facebook, computer, internet, and similar) ' +
        'in their original English form so the result stays pretty and readable. ' +
        'Return ONLY the converted text — no explanations, no quotes.\n\n---\n' + text);
      $('bl-output').value = out.trim();
      status($('bl-status'), '✓ Done.', true);
    } catch (e) { status($('bl-status'), '✕ ' + e.message, false); }
    btn.disabled = false;
  };
  $('bl-convert').onclick = run;
  $('bl-copy').onclick = () => copy($('bl-output').value);
  $('bl-clear').onclick = () => { $('bl-input').value = ''; $('bl-output').value = ''; status($('bl-status'), '', null); };
  $('bl-input').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  });
};
