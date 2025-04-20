import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const projectRootDir = path.resolve(__dirname);

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.browser.js',
      format: 'umd',
      name: 'RsiScraper',
      exports: 'named',
      sourcemap: true,
      globals: {
        axios: 'axios',
        cheerio: 'cheerio'
      }
    },
    {
      file: 'dist/index.browser.min.js',
      format: 'umd',
      name: 'RsiScraper',
      exports: 'named',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        axios: 'axios',
        cheerio: 'cheerio'
      }
    }
  ],
  external: ['axios', 'cheerio'],
  plugins: [
    alias({
      entries: [
      ]
    }),
    json(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};
