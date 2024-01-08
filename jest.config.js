module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', __dirname],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
