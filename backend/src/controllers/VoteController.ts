import { Request, Response, NextFunction } from 'express';
import { VoteModel } from '../models/Vote';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const voteSchema = z.object({
  featureId: z.number().int().positive(),
});

export class VoteController {
  async vote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { featureId } = voteSchema.parse(req.body);
      
      // Get user ID from authenticated request
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const userId = req.user.userId;

      // Check if user already voted
      const hasVoted = await VoteModel.hasUserVoted(userId, featureId);
      if (hasVoted) {
        return res.status(400).json({ error: 'User has already voted for this feature' });
      }

      const vote = await VoteModel.create(userId, featureId);
      const voteCount = await VoteModel.getCount(featureId);
      
      res.status(201).json({ 
        vote, 
        voteCount,
        message: 'Vote recorded successfully' 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      next(error);
    }
  }

  async removeVote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const featureId = parseInt(req.params.featureId);
      if (isNaN(featureId)) {
        return res.status(400).json({ error: 'Invalid feature ID' });
      }

      // Get user ID from authenticated request
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const userId = req.user.userId;

      const removed = await VoteModel.remove(userId, featureId);
      if (!removed) {
        return res.status(404).json({ error: 'Vote not found' });
      }

      const voteCount = await VoteModel.getCount(featureId);
      
      res.status(200).json({ 
        voteCount,
        message: 'Vote removed successfully' 
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeatureVotes(req: Request, res: Response, next: NextFunction) {
    try {
      const featureId = parseInt(req.params.featureId);
      if (isNaN(featureId)) {
        return res.status(400).json({ error: 'Invalid feature ID' });
      }

      const voteCount = await VoteModel.getCount(featureId);
      const votes = await VoteModel.getByFeature(featureId);
      
      res.status(200).json({ 
        voteCount,
        votes: votes.length,
        voters: votes.map(v => ({ userId: v.user_id, votedAt: v.created_at }))
      });
    } catch (error) {
      next(error);
    }
  }
}