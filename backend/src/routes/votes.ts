import { Router } from 'express';
import { VoteController } from '../controllers/VoteController';
import { authenticate } from '../middleware/auth';

const router = Router();
const voteController = new VoteController();

router.post('/', authenticate, voteController.vote);
router.delete('/:featureId', authenticate, voteController.removeVote);
router.get('/feature/:featureId', voteController.getFeatureVotes);

export { router as voteRoutes };