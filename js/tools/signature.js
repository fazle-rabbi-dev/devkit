/* Digital signature: ECDSA P-256 + SHA-256 create & validate */
window.DevTools.initSignature = function () {
  const { $, status, b64encode, b64decode, copy } = window.DevTools.utils;
  let keys = null;
  async function exportKeys() {
    $('sig-pub').value = JSON.stringify(await crypto.subtle.exportKey('jwk', keys.publicKey));
    $('sig-priv').value = JSON.stringify(await crypto.subtle.exportKey('jwk', keys.privateKey));
  }
  async function importKeys() {
    try {
      const pub = JSON.parse($('sig-pub').value), priv = JSON.parse($('sig-priv').value);
      keys = {
        publicKey: await crypto.subtle.importKey('jwk', pub, { name: 'ECDSA', namedCurve: 'P-256' }, true, ['verify']),
        privateKey: await crypto.subtle.importKey('jwk', priv, { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign']),
      };
      return true;
    } catch { return false; }
  }
  $('sig-gen').onclick = async () => {
    keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    await exportKeys(); status($('sig-status'), '✓ New ECDSA P-256 keypair generated.', true);
  };
  $('sig-sign').onclick = async () => {
    if (!keys && !(await importKeys())) return status($('sig-status'), 'Generate or paste a valid keypair first.', false);
    if (!keys) await importKeys();
    if ($('sig-priv').value && !keys) return;
    try {
      if (!keys) { status($('sig-status'), 'No private key loaded.', false); return; }
      const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, keys.privateKey, new TextEncoder().encode($('sig-msg').value)));
      $('sig-sig').value = b64encode(sig);
      status($('sig-status'), '✓ Message signed.', true);
    } catch (e) { status($('sig-status'), 'Sign error: ' + e.message, false); }
  };
  $('sig-verify').onclick = async () => {
    if (!keys && !(await importKeys())) return status($('sig-status'), 'Generate or paste a valid keypair first.', false);
    try {
      const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, keys.publicKey, b64decode($('sig-sig').value.trim()), new TextEncoder().encode($('sig-msg').value));
      status($('sig-status'), ok ? '✓ VALID signature — message is authentic.' : '✕ INVALID signature.', ok);
    } catch (e) { status($('sig-status'), 'Verify error: ' + e.message, false); }
  };
  $('sig-copy-pub').onclick = () => copy($('sig-pub').value);
  $('sig-copy-priv').onclick = () => copy($('sig-priv').value);
  $('sig-gen').click();
};
