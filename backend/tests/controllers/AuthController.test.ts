// Mock dependencies first
jest.mock('./src/models/User');
jest.mock('jsonwebtoken');

import { AuthController } from './src/controllers/AuthController';
import { UserModel } from './src/models/User';
import jwt from 'jsonwebtoken';

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// Simple mock objects
const createMockRequest = (overrides: any = {}): any => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides
});

const createMockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe('AuthController', () => {
  let authController: AuthController;
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.MockedFunction<any>;

  beforeEach(() => {
    authController = new AuthController();
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const validRegisterData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockReq.body = validRegisterData;
      mockUserModel.findByEmail.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(userData);
      mockJwt.sign.mockReturnValue('fake-jwt-token');

      await authController.register(mockReq as any, mockRes as any, mockNext);

      expect(mockUserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserModel.create).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        },
        token: 'fake-jwt-token'
      });
    });

    it('should return 400 when user already exists', async () => {
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      mockUserModel.findByEmail.mockResolvedValue({
        id: 1,
        username: 'existinguser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      });

      await authController.register(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User already exists with this email'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockReq.body = validLoginData;
      mockUserModel.findByEmail.mockResolvedValue(userData);
      mockUserModel.verifyPassword.mockResolvedValue(true);
      mockJwt.sign.mockReturnValue('fake-jwt-token');

      await authController.login(mockReq as any, mockRes as any, mockNext);

      expect(mockUserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserModel.verifyPassword).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        },
        token: 'fake-jwt-token'
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      mockUserModel.findByEmail.mockResolvedValue(null);

      await authController.login(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });
  });
});