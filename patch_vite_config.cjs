const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace(
  "VitePWA({\n        registerType: 'autoUpdate',",
  "VitePWA({\n        registerType: 'autoUpdate',\n        workbox: {\n          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,\n        },"
);

fs.writeFileSync('vite.config.ts', code);
