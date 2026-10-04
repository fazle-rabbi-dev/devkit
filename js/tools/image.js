/* Image paste → PNG download */
window.DevTools.initImage = function () {
  const { $ } = window.DevTools.utils;
  const drop = $('img-drop'), file = $('img-file'), prev = $('img-preview'), meta = $('img-meta'), dl = $('img-download');
  let pngBlob = null, fname = 'image.png';
  function loadBlob(blob, name) {
    fname = (name || 'pasted-image').replace(/\.\w+$/, '') + '.png';
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      c.toBlob(b => {
        pngBlob = b; const purl = URL.createObjectURL(b);
        prev.src = purl; prev.style.display = 'block';
        meta.textContent = `${img.naturalWidth} × ${img.naturalHeight}px · ${(b.size / 1024).toFixed(1)} KB · PNG`;
        dl.disabled = false; URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }
  document.addEventListener('paste', e => {
    if (!document.querySelector('#tool-image.active')) return;
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (item) loadBlob(item.getAsFile(), 'pasted-image');
  });
  $('img-paste-btn').onclick = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const it of items) { const t = it.types.find(t => t.startsWith('image/')); if (t) { loadBlob(await it.getType(t), 'clipboard'); return; } }
      window.DevTools.utils.toast('No image in clipboard — press Ctrl+V instead');
    } catch { window.DevTools.utils.toast('Clipboard blocked — press Ctrl+V in the dropzone'); }
  };
  $('img-browse').onclick = () => file.click();
  drop.onclick = () => file.click();
  file.onchange = () => file.files[0] && loadBlob(file.files[0], file.files[0].name);
  ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => { const f = [...e.dataTransfer.files].find(f => f.type.startsWith('image/')); if (f) loadBlob(f, f.name); });
  dl.onclick = () => pngBlob && window.DevTools.utils.download(fname, pngBlob);
  $('img-clear').onclick = () => { pngBlob = null; prev.style.display = 'none'; prev.src = ''; meta.textContent = ''; dl.disabled = true; file.value = ''; };
};
