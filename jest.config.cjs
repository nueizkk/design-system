/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.ts'],
  moduleNameMapper: {
    '^test-util$': '<rootDir>/src/test-utils/index.ts',
    '^tokens$': '<rootDir>/src/tokens/index.ts',
    '\\.css$': '<rootDir>/src/test-utils/styleMock.js',
  },
};
