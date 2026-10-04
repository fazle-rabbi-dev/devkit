/* AES-GCM encrypt/decrypt with PBKDF2 password key. Format: saltB64.ivB64.dataB64 */
window.DevTools.initEncrypt = function () {
  const { $, status, b64encode, b64decode } = window.DevTools.utils;
  async function derive(pass, salt) {
    const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  $('crypto-enc').onclick = async () => {
    try {
      const pass = $('crypto-pass').value, pt = $('crypto-plain').value;
      if (!pass || !pt) return status($('crypto-status'), 'Enter password + plaintext.', false);
      const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await derive(pass, salt);
      const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(pt)));
      $('crypto-cipher').value = `${b64encode(salt)}.${b64encode(iv)}.${b64encode(ct)}`;
      status($('crypto-status'), '✓ Encrypted (AES-GCM 256, 100k PBKDF2 rounds).', true);
    } catch (e) { status($('crypto-status'), 'Error: ' + e.message, false); }
  };
  $('crypto-dec').onclick = async () => {
    try {
      const pass = $('crypto-pass').value, parts = $('crypto-cipher').value.trim().split('.');
      if (!pass || parts.length !== 3) return status($('crypto-status'), 'Need password + salt.iv.data ciphertext.', false);
      const [salt, iv, data] = parts.map(b64decode);
      const key = await derive(pass, salt);
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      $('crypto-plain').value = new TextDecoder().decode(pt);
      status($('crypto-status'), '✓ Decrypted successfully.', true);
    } catch { status($('crypto-status'), '✕ Decrypt failed — wrong password or corrupted data.', false); }
  };
  $('crypto-clear').onclick = () => { $('crypto-plain').value = ''; $('crypto-cipher').value = ''; status($('crypto-status'), '', null); };
};
