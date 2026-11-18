// Copies the built web app into packages/bruno-electron/web and rewrites its asset paths for Electron.
// Shared by package-win.cjs and package-mac.cjs; mirrors the first half of scripts/build-electron.js.
const fs = require('fs');
const path = require('path');

module.exports = function prepareElectronWeb() {
  const web = 'packages/bruno-electron/web';
  fs.rmSync('packages/bruno-electron/out', { recursive: true, force: true });
  fs.rmSync(web, { recursive: true, force: true });
  fs.cpSync('packages/bruno-app/dist', web, { recursive: true });
  for (const f of fs.readdirSync(web).filter((n) => n.endsWith('.html'))) {
    const p = path.join(web, f);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\/static/g, './static'));
  }
  const css = path.join(web, 'static/css');
  if (fs.existsSync(css)) {
    for (const f of fs.readdirSync(css).filter((n) => n.endsWith('.css'))) {
      const p = path.join(css, f);
      fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\/static\/font/g, '../../static/font'));
    }
  }
  for (const f of fs.readdirSync(web).filter((n) => n.endsWith('.map'))) fs.rmSync(path.join(web, f));
};
