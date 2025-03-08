export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '@commands': '<rootDir>/src/commands',
    '@types': '<rootDir>/src/types'
  },
  testTimeout: 30000 // Increase timeout for network requests
};
