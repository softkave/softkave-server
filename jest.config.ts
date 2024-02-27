import {InitialOptionsTsJest} from 'ts-jest/dist/types';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/jest/', '/build/'],
  testTimeout: 300000, // 300 seconds or 5 minutes
  globalTeardown: './src/jest/globalTeardown.ts',
  globalSetup: './src/jest/globalSetup.unit-test.ts',
};

module.exports = config;
