import path from 'path';
import { defineConfig } from 'vitest/config';

// Run tests in a non-UTC timezone so local-time date parsing fails the same way on every machine, CI included.
// It must be set here: worker threads ignore changes to process.env.TZ made inside a test.
process.env.TZ = 'Pacific/Kiritimati';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.github', '.copilot', '.squad', '.vscode', '.cache'],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
      ],
    },
    pool: {
      name: 'threads',
      options: {
        singleThread: false,
        isolate: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

export { defineConfig };
