module.exports = {
  moduleNameMapper: {
    "oracledb": "<rootDir>/.jest/mocks/oracledb.ts"
  },
  preset: 'ts-jest',
  setupFiles: ["<rootDir>/.jest/setup/envVars.js"],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '.d.ts',
    '.js',
  ]
};