/* Lorem ipsum generator */
window.DevTools.initLorem = function () {
  const { $, copy } = window.DevTools.utils;
  const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam eaque ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo enim ipsam quia voluptas sit aspernatur aut odit fugit consequuntur magni dolores eos ratione sequi nesciunt neque porro quisquam dolorem numquam eius modi tempora incidunt magnam quaerat'.split(' ');
  const rnd = (n) => Math.floor(Math.random() * n);
  const word = () => WORDS[rnd(WORDS.length)];
  const sentence = () => { const len = 6 + rnd(10); let s = []; for (let i = 0; i < len; i++) s.push(word()); s[0] = s[0][0].toUpperCase() + s[0].slice(1); return s.join(' ') + '.'; };
  const para = () => { const len = 4 + rnd(4); let s = []; for (let i = 0; i < len; i++) s.push(sentence()); return s.join(' '); };
  $('lorem-go').onclick = () => {
    const n = Math.min(100, Math.max(1, +$('lorem-count').value || 3));
    const type = $('lorem-type').value; let out = '';
    if (type === 'words') { let w = []; for (let i = 0; i < n; i++) w.push(word()); out = w.join(' '); }
    else if (type === 'sentences') { let s = []; for (let i = 0; i < n; i++) s.push(sentence()); out = s.join(' '); }
    else { let p = []; for (let i = 0; i < n; i++) p.push(para()); out = p.join('\n\n'); }
    if ($('lorem-classic').checked && !out.toLowerCase().startsWith('lorem ipsum')) out = 'Lorem ipsum dolor sit amet, ' + out[0].toLowerCase() + out.slice(1);
    $('lorem-output').value = out;
  };
  $('lorem-copy').onclick = () => copy($('lorem-output').value);
  $('lorem-go').click();
};
