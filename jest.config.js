/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  displayName: 'Chat-application-rest-api-tests',
  moduleNameMapper: {
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@App/(.*)$': '<rootDir>/src/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@ioc/(.*)$': '<rootDir>/src/ioc/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1'
  },
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/tests']
};
