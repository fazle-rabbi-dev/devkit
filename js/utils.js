/* Shared helpers. All tool modules use window.DevTools.utils */
window.DevTools = window.DevTools || {};
window.DevTools.utils = {
  $: (id) => document.getElementById(id),
  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1800);
  },
  async copy(text) {
    try { await navigator.clipboard.writeText(text); this.toast('Copied to clipboard'); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); this.toast('Copied'); }
  },
  download(filename, blobOrText, mime = 'text/plain') {
    const blob = blobOrText instanceof Blob ? blobOrText : new Blob([blobOrText], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  },
  b64encode(bytes) { let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s); },
  b64decode(b64) { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; },
  hex(bytes) { return [...bytes].map(b => b.toString(16).padStart(2, '0')).join(''); },
  unhex(h) { const u = new Uint8Array(h.length / 2); for (let i = 0; i < u.length; i++) u[i] = parseInt(h.substr(i * 2, 2), 16); return u; },
  status(el, msg, ok) { el.textContent = msg; el.className = 'status ' + (ok === true ? 'ok' : ok === false ? 'err' : ''); }
};
