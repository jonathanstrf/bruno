// Packs an unsigned macOS .dmg and .zip into packages/bruno-electron/out (run `npm run build:web` first, on a Mac).
// Usage: node scripts/package-mac.cjs [arm64|x64]
// The upstream config signs with the maintainers' Apple identity, so signing is switched off here.
const path = require('path');
const { execSync } = require('child_process');

const arch = process.argv[2] || 'arm64';
if (!['arm64', 'x64'].includes(arch)) throw new Error(`Unsupported arch: ${arch}`);

process.chdir(path.join(__dirname, '..'));
require('./prepare-electron-web.cjs')();
execSync(
  `npx electron-builder --mac dmg zip --${arch} --config electron-builder-config.js -c.mac.identity=null -c.mac.hardenedRuntime=false`,
  { cwd: 'packages/bruno-electron', stdio: 'inherit', env: { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: 'false' } },
);
