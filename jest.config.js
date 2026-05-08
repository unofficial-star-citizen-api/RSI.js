/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: { '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tests/tsconfig.json' }] },
  transformIgnorePatterns: [
    'node_modules/(?!(http-proxy-agent|https-proxy-agent|socks-proxy-agent|agent-base)/)'
  ],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testTimeout: 30000
};
