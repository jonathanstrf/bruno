// Packs an unpacked x64 Windows app into packages/bruno-electron/out/win-unpacked (run `npm run build:web` first).
// Mirrors scripts/build-electron.js but builds only x64, without the NSIS installers: the arm64 half needs Visual Studio
// to rebuild native-reg and fails without it. electron-builder skips signing on its own when no certificate is set.
const path = require('path');
const { execSync } = require('child_process');

process.chdir(path.join(__dirname, '..'));
require('./prepare-electron-web.cjs')();
execSync('npx electron-builder --win dir --x64 --config electron-builder-config.js -c.win.signExecutable=false', {
  cwd: 'packages/bruno-electron',
  stdio: 'inherit',
});
