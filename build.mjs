import * as esbuild from 'esbuild';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const isWatch = process.argv.includes('--watch');

const moduleEntryPoints = [];
const collectEntryPoints = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      collectEntryPoints(path);
    } else if (entry.isFile() && path.endsWith('.ts') && !path.endsWith('.test.ts') && path !== 'src/index.ts') {
      moduleEntryPoints.push(path);
    }
  }
};
collectEntryPoints('src');

const sharedNode = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  external: ['axios', 'cheerio'],
  sourcemap: true,
};

const sharedBrowser = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'browser',
  globalName: 'RSI',
  external: ['http-proxy-agent', 'https-proxy-agent', 'socks-proxy-agent'],
  sourcemap: true,
};

if (isWatch) {
  const ctx = await esbuild.context({
    ...sharedNode, format: 'cjs', outfile: 'dist/index.js'
  });
  await ctx.watch();
  console.log('Watching...');
} else {
  await Promise.all([
    esbuild.build({
      ...sharedNode, format: 'cjs', outfile: 'dist/index.js'
    }),
    esbuild.build({
      ...sharedNode, format: 'esm', outfile: 'dist/index.esm.js'
    }),
    esbuild.build({
      ...sharedBrowser, format: 'iife', outfile: 'dist/index.browser.js'
    }),
    esbuild.build({
      ...sharedBrowser, format: 'iife', minify: true, outfile: 'dist/index.browser.min.js'
    }),
    esbuild.build({
      entryPoints: moduleEntryPoints,
      bundle: false,
      format: 'cjs',
      platform: 'node',
      outbase: 'src',
      outdir: 'dist',
      packages: 'external',
      sourcemap: true,
    }),
  ]);
  console.log('Build complete');
}
