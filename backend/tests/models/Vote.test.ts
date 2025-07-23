// Mock the database connection first
jest.mock('./src/database/connection', () => ({
  query: jest.fn(),
  getClient: jest.fn()
}));

import { VoteModel, Vote } from './src/models/Vote';
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

describe('VoteModel', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('create', () => {
    it('should create a new vote', async () => {
      const voteData = {
        id: 1,
        user_id: 1,
        feature_id: 1,
        created_at: '2023-01-01T00:00:00.000Z'
      };

      mockQuery.mockResolvedValue(createMockQueryResult([voteData]));

      const result = await VoteModel.create(1, 1);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO votes (user_id, feature_id) VALUES ($1, $2) RETURNING *',
        [1, 1]
      );
      expect(result).toEqual(voteData);
    });
  });

  describe('hasUserVoted', () => {
    it('should return true when user has voted for feature', async () => {
      mockQuery.mockResolvedValue(createMockQueryResult([{ '?column?': 1 }]));

      const result = await VoteModel.hasUserVoted(1, 1);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM votes WHERE user_id = $1 AND feature_id = $2',
        [1, 1]
      );
      expect(result).toBe(true);
    });

    it('should return false when user has not voted for feature', async () => {
      mockQuery.mockResolvedValue(createMockQueryResult([]));

      const result = await VoteModel.hasUserVoted(1, 999);

      expect(result).toBe(false);
    });
  });

  describe('getCount', () => {
    it('should return vote count for a feature', async () => {
      mockQuery.mockResolvedValue(createMockQueryResult([{ count: '5' }]));

      const result = await VoteModel.getCount(1);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM votes WHERE feature_id = $1',
        [1]
      );
      expect(result).toBe(5);
    });
  });
});