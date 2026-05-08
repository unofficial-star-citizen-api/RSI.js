import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'module';
import typescript from 'rollup-plugin-typescript2';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

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
      name: 'RSI.js',
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
      name: 'RSI.js',
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
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
      typescript: require('typescript'),
      clean: true,
      include: ['src/**/*', 'src/*']
    }),
    json(),
    resolve({
      extensions: ['.js', '.ts']
    }),
    commonjs()
  ]
};
