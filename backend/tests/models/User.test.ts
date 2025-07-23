// Mock the database connection first
jest.mock('./src/database/connection', () => ({
  query: jest.fn(),
  getClient: jest.fn()
}));

// Mock bcrypt
jest.mock('bcryptjs');

import { UserModel, User } from './src/models/User';
import { query } from './src/database/connection';
import bcrypt from 'bcryptjs';

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Helper to create mock query results
const createMockQueryResult = (rows: any[], rowCount = rows.length) => ({
  rows,
  rowCount,
  command: 'SELECT',
  oid: 0,
  fields: []
});

describe('UserModel', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockBcrypt.hash.mockReset();
    mockBcrypt.compare.mockReset();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockBcrypt.hash.mockResolvedValue('hashed_password' as never);
      mockQuery.mockResolvedValue(createMockQueryResult([userData]));

      const result = await UserModel.create('testuser', 'test@example.com', 'password123');

      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', expect.any(Number));
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        ['testuser', 'test@example.com', 'hashed_password']
      );
      expect(result).toEqual(userData);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockQuery.mockResolvedValue(createMockQueryResult([userData]));

      const result = await UserModel.findByEmail('test@example.com');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(userData);
    });

    it('should return null when user not found', async () => {
      mockQuery.mockResolvedValue(createMockQueryResult([]));

      const result = await UserModel.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await UserModel.verifyPassword('password123', 'hashed_password');

      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await UserModel.verifyPassword('wrongpassword', 'hashed_password');

      expect(result).toBe(false);
    });
  });
});