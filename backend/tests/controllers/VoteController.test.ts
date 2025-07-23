import { VoteController } from './src/controllers/VoteController';
import { VoteModel } from './src/models/Vote';
import { createMockRequest, createMockResponse, createMockNext, MockResponse } from '../helpers/mockExpressObjects';

// Mock dependencies
jest.mock('./src/models/Vote');

const mockVoteModel = VoteModel as jest.Mocked<typeof VoteModel>;

describe('VoteController', () => {
  let voteController: VoteController;
  let mockReq: Partial<Request>;
  let mockRes: MockResponse;
  let mockNext: jest.MockedFunction<any>;

  beforeEach(() => {
    voteController = new VoteController();
    mockReq = createMockRequest();
    mockRes = createMockResponse() as MockResponse;
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe('vote', () => {
    it('should create a vote successfully', async () => {
      const validVoteData = { featureId: 1 };
      const voteData = {
        id: 1,
        user_id: 1,
        feature_id: 1,
        created_at: '2023-01-01T00:00:00.000Z'
      };

      mockReq.body = validVoteData;
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockVoteModel.hasUserVoted.mockResolvedValue(false);
      mockVoteModel.create.mockResolvedValue(voteData);
      mockVoteModel.getCount.mockResolvedValue(5);

      await voteController.vote(mockReq as any, mockRes as any, mockNext);

      expect(mockVoteModel.hasUserVoted).toHaveBeenCalledWith(1, 1);
      expect(mockVoteModel.create).toHaveBeenCalledWith(1, 1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        vote: voteData,
        voteCount: 5,
        message: 'Vote recorded successfully'
      });
    });

    it('should return 400 when user has already voted', async () => {
      mockReq.body = { featureId: 1 };
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockVoteModel.hasUserVoted.mockResolvedValue(true);

      await voteController.vote(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User has already voted for this feature'
      });
    });
  });

  describe('removeVote', () => {
    it('should remove vote successfully', async () => {
      mockReq.params = { featureId: '1' };
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockVoteModel.remove.mockResolvedValue(true);
      mockVoteModel.getCount.mockResolvedValue(4);

      await voteController.removeVote(mockReq as any, mockRes as any, mockNext);

      expect(mockVoteModel.remove).toHaveBeenCalledWith(1, 1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        voteCount: 4,
        message: 'Vote removed successfully'
      });
    });
  });
});