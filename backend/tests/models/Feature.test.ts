// Mock the database connection first
jest.mock('./src/database/connection', () => ({
  query: jest.fn(),
  getClient: jest.fn()
}));

import { FeatureModel, Feature } from './src/models/Feature';
import { query } from './src/database/connection';

const mockQuery = query as jest.MockedFunction<typeof query>;

// Helper to create mock query results
const createMockQueryResult = (rows: any[], rowCount = rows.length) => ({
  rows,
  rowCount,
  command: 'SELECT',
  oid: 0,
  fields: []
});

describe('FeatureModel', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('getAllWithVotes', () => {
    it('should return all features with vote counts', async () => {
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

      mockQuery.mockResolvedValue(createMockQueryResult(featuresData));

      const result = await FeatureModel.getAllWithVotes();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(result).toEqual(featuresData);
    });
  });

  describe('create', () => {
    it('should create a new feature', async () => {
      const featureData = {
        id: 1,
        title: 'New Feature',
        description: 'Feature description',
        created_by: 1,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockQuery.mockResolvedValue(createMockQueryResult([featureData]));

      const result = await FeatureModel.create('New Feature', 'Feature description', 1);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO features (title, description, created_by) VALUES ($1, $2, $3) RETURNING *',
        ['New Feature', 'Feature description', 1]
      );
      expect(result).toEqual(featureData);
    });
  });

  describe('getById', () => {
    it('should return feature when found', async () => {
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

      mockQuery.mockResolvedValue(createMockQueryResult([featureData]));

      const result = await FeatureModel.getById(1);

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE'), [1]);
      expect(result).toEqual(featureData);
    });
  });
});