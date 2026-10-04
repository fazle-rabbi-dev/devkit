/* Encoding / decoding: base64, base64url, url, html, hex, unicode */
window.DevTools.initEncoding = function () {
  const { $, status } = window.DevTools.utils;
  const plain = $('enc-plain'), coded = $('enc-coded'), codec = $('enc-codec'), st = $('enc-status');
  const te = new TextEncoder(), td = new TextDecoder();
  const C = {
    base64: { enc: s => btoa(String.fromCharCode(...te.encode(s))), dec: s => td.decode(Uint8Array.from(atob(s.trim()), c => c.charCodeAt(0))) },
    base64url: { enc: s => C.base64.enc(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''), dec: s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return C.base64.dec(s); } },
    url: { enc: s => encodeURIComponent(s), dec: s => decodeURIComponent(s) },
    html: { enc: s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'), dec: s => { const d = document.createElement('div'); d.innerHTML = s; return d.textContent; } },
    hex: { enc: s => [...te.encode(s)].map(b => b.toString(16).padStart(2, '0')).join(''), dec: s => { s = s.replace(/\s/g, ''); const u = new Uint8Array(s.length / 2); for (let i = 0; i < u.length; i++) u[i] = parseInt(s.substr(i * 2, 2), 16); return td.decode(u); } },
    unicode: { enc: s => [...s].map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''), dec: s => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))) },
  };
  $('enc-encode').onclick = () => { try { coded.value = C[codec.value].enc(plain.value); status(st, 'Encoded with ' + codec.value, true); } catch (e) { status(st, 'Encode error: ' + e.message, false); } };
  $('enc-decode').onclick = () => { try { plain.value = C[codec.value].dec(coded.value); status(st, 'Decoded with ' + codec.value, true); } catch (e) { status(st, 'Decode error: ' + e.message, false); } };
  $('enc-swap').onclick = () => { const t = plain.value; plain.value = coded.value; coded.value = t; };
};
