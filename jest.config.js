/* eslint-disable no-undef */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/config/jest/fileMock.ts',
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/config/jest/styleMock.ts',
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  setupFiles: ['./config/jest/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupTests.ts'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ['<rootDir>/src'],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/build/"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: [
    "text"
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
};