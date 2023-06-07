import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    testMatch: ['<rootDir>/dist/src/**/*.test.js'],
};

export default config;
