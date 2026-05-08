import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

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
  ]);
  console.log('Build complete');
}
