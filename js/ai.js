/* Shared Gemini AI core: key + model in localStorage, lazy SDK load, settings modal.
   SDK: official @google/genai via CDN (no npm). Client-side key is exposed to
   anyone with device access — use a backend proxy for production. */
window.DevTools.ai = (() => {
  const KEY = 'devkit-gemini-key', MODEL = 'devkit-gemini-model';
  const DEFAULT_MODEL = 'gemini-flash-latest';
  let sdkMod = null;

  const getKey = () => (localStorage.getItem(KEY) || '').trim();
  const getModel = () => (localStorage.getItem(MODEL) || '').trim() || DEFAULT_MODEL;

  async function loadSdk() {
    if (sdkMod) return sdkMod;
    try { sdkMod = await import('https://esm.run/@google/genai'); }
    catch { sdkMod = await import('https://esm.sh/@google/genai'); }
    return sdkMod;
  }

  async function generate(prompt) {
    const key = getKey();
    if (!key) throw new Error('No API key set — click the gear icon in the topbar to add your Gemini API key.');
    const { GoogleGenAI } = await loadSdk();
    const ai = new GoogleGenAI({ apiKey: key });
    const res = await ai.models.generateContent({ model: getModel(), contents: prompt });
    if (!res.text) throw new Error('Empty response from model.');
    return res.text;
  }

  return { getKey, getModel, DEFAULT_MODEL, generate };
})();

/* Settings modal wiring (topbar gear). */
window.DevTools.initAi = function () {
  const { $, toast } = window.DevTools.utils;
  const backdrop = $('ai-modal-backdrop');
  const refresh = () => $('ai-settings-btn').classList.toggle('has-key', !!window.DevTools.ai.getKey());
  const open = () => {
    $('ai-key').value = window.DevTools.ai.getKey();
    $('ai-model').value = localStorage.getItem('devkit-gemini-model') || '';
    $('ai-model').placeholder = window.DevTools.ai.DEFAULT_MODEL;
    backdrop.hidden = false;
  };
  $('ai-settings-btn').onclick = open;
  $('ai-modal-close').onclick = () => backdrop.hidden = true;
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.hidden = true; });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') backdrop.hidden = true; });
  $('ai-show').onchange = e => $('ai-key').type = e.target.checked ? 'text' : 'password';
  $('ai-save').onclick = () => {
    localStorage.setItem('devkit-gemini-key', $('ai-key').value.trim());
    const m = $('ai-model').value.trim();
    if (m) localStorage.setItem('devkit-gemini-model', m);
    else localStorage.removeItem('devkit-gemini-model');
    refresh(); backdrop.hidden = true; toast('AI settings saved');
  };
  $('ai-clear-key').onclick = () => {
    localStorage.removeItem('devkit-gemini-key');
    $('ai-key').value = ''; refresh(); toast('API key removed');
  };
  refresh();
};
