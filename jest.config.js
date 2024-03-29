/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  displayName: 'CipherConvo-api-tests',
  moduleNameMapper: {
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@App/(.*)$': '<rootDir>/src/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@ioc/(.*)$': '<rootDir>/src/ioc/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/api/middlewares/$1',
    '^@controllers/(.*)$': '<rootDir>/src/api/controllers/$1',
    '^@models/(.*)$': '<rootDir>/src/api/models/$1',
    '^@services/(.*)$': '<rootDir>/src/api/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/api/repositories/$1'
  },
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/tests']
};
