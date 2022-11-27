import esbuild from 'esbuild';
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck';
import tunnel from 'localtunnel';

import fs from 'fs';
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let deps = Object.keys(json.dependencies);

esbuild
  .build({
    watch: true,
    platform: 'node',
    logLevel: 'info',
    entryPoints: [ 'src/index.ts' ],
    bundle: true,
    minify: false,
    format: 'esm',
    target: 'node16',
    outdir: 'dist',
    external: deps,
    plugins: [typecheckPlugin({
      watch: true
    })]
  })
  .catch(() => process.exit(1));

tunnel({ port: 3000, subdomain: 'addtodoist-settings' }, (err, tunnel) => {
  console.log('LT running', tunnel.url);
});
