/* Password hashing + validation (WebCrypto SHA) */
window.DevTools.initPassword = function () {
  const { $, copy, status } = window.DevTools.utils;
  async function digest(algo, text) {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
    return window.DevTools.utils.hex(new Uint8Array(buf));
  }
  $('pw-hash').onclick = async () => {
    const p = $('pw-input').value; if (!p) return status($('pw-result'), '', null);
    $('pw-output').value = await digest($('pw-algo').value, p);
    status($('pw-result'), 'Hashed with ' + $('pw-algo').value, true);
  };
  $('pw-generate').onclick = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let s = ''; crypto.getRandomValues(new Uint8Array(20)).forEach(b => s += chars[b % chars.length]);
    $('pw-input').value = s; $('pw-hash').click(); copy(s);
  };
  $('pw-copy').onclick = () => copy($('pw-output').value);
  $('pw-verify').onclick = async () => {
    const cand = $('pw-check-input').value, exp = $('pw-check-hash').value.trim().toLowerCase();
    if (!cand || !exp) return status($('pw-result'), 'Enter both password and expected hash.', false);
    for (const algo of ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1']) {
      if ((await digest(algo, cand)) === exp) return status($('pw-result'), `✓ Match! Algorithm: ${algo}`, true);
    }
    status($('pw-result'), '✕ No match for SHA-1/256/384/512.', false);
  };
};
