const globals = require('./globals')

/** @type any */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['react-native'],
  },
  transform: {
    '\\.svg$': 'jest-transformer-svg',
    '^.+\\.jsx?$': 'babel-jest',
  },
  // coverageDirectory: '<rootDir>/coverage',
  // coverageReporters: ['json','lcov','html'],
  // collectCoverageFrom: [
  //   '<rootDir>/pkgs/**/src/**/*.ts',
