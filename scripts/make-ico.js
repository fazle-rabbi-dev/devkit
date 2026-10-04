// Regenerates assets/icon.ico from assets/icon.png (required for the Windows installer).
const fs = require('node:fs');
const path = require('node:path');
const pngToIco = require('png-to-ico').default;

const root = path.join(__dirname, '..');
pngToIco(path.join(root, 'assets', 'icon.png'))
  .then((buf) => {
    fs.writeFileSync(path.join(root, 'assets', 'icon.ico'), buf);
    console.log('assets/icon.ico written', buf.length, 'bytes');
  })
  .catch((err) => {
    console.error('icon.ico generation failed:', err.message);
    process.exit(1);
  });
