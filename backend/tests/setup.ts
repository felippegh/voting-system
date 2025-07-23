import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.BCRYPT_SALT_ROUNDS = '1'; // Faster for tests

// Mock console.log for cleaner test output
const originalLog = console.log;
console.log = (...args: any[]) => {
  if (process.env.VERBOSE_TESTS === 'true') {
    originalLog(...args);
  }
};

// Global test utilities
global.afterEach(() => {
  jest.clearAllMocks();
});