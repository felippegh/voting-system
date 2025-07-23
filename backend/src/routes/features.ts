import { Router } from 'express';
import { FeatureController } from '../controllers/FeatureController';
import { authenticate } from '../middleware/auth';

const router = Router();
const featureController = new FeatureController();

router.get('/', featureController.getAllFeatures);
router.post('/', authenticate, featureController.createFeature);
router.get('/:id', featureController.getFeature);
router.put('/:id', authenticate, featureController.updateFeature);
router.delete('/:id', authenticate, featureController.deleteFeature);

export { router as featureRoutes };