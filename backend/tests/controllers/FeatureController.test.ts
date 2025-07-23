// Mock dependencies first
jest.mock('./src/models/Feature');

import { FeatureController } from './src/controllers/FeatureController';
import { FeatureModel } from './src/models/Feature';
import { createMockRequest, createMockResponse, createMockNext, MockResponse } from '../helpers/mockExpressObjects';

const mockFeatureModel = FeatureModel as jest.Mocked<typeof FeatureModel>;

describe('FeatureController', () => {
  let featureController: FeatureController;
  let mockReq: Partial<Request>;
  let mockRes: MockResponse;
  let mockNext: jest.MockedFunction<any>;

  beforeEach(() => {
    featureController = new FeatureController();
    mockReq = createMockRequest();
    mockRes = createMockResponse() as MockResponse;
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe('getAllFeatures', () => {
    it('should return all features with votes', async () => {
      const featuresData = [
        {
          id: 1,
          title: 'Feature 1',
          description: 'Description 1',
          created_by: 1,
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
          created_by_username: 'user1',
          vote_count: 5
        }
      ];

      mockFeatureModel.getAllWithVotes.mockResolvedValue(featuresData);

      await featureController.getAllFeatures(mockReq as any, mockRes as any, mockNext);

      expect(mockFeatureModel.getAllWithVotes).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ features: featuresData });
    });
  });

  describe('createFeature', () => {
    it('should create a new feature successfully', async () => {
      const validFeatureData = {
        title: 'New Feature',
        description: 'New feature description'
      };

      const createdFeature = {
        id: 1,
        title: 'New Feature',
        description: 'New feature description',
        created_by: 1,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockReq.body = validFeatureData;
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockFeatureModel.create.mockResolvedValue(createdFeature);

      await featureController.createFeature(mockReq as any, mockRes as any, mockNext);

      expect(mockFeatureModel.create).toHaveBeenCalledWith('New Feature', 'New feature description', 1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        feature: createdFeature,
        message: 'Feature created successfully'
      });
    });
  });

  describe('getFeature', () => {
    it('should return feature by ID', async () => {
      const featureData = {
        id: 1,
        title: 'Test Feature',
        description: 'Test Description',
        created_by: 1,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        created_by_username: 'testuser',
        vote_count: 2
      };

      mockReq.params = { id: '1' };
      mockFeatureModel.getById.mockResolvedValue(featureData);

      await featureController.getFeature(mockReq as any, mockRes as any, mockNext);

      expect(mockFeatureModel.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ feature: featureData });
    });
  });
});