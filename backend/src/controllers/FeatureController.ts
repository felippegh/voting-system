import { Request, Response, NextFunction } from 'express';
import { FeatureModel } from '../models/Feature';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const createFeatureSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

const updateFeatureSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

export class FeatureController {
  async getAllFeatures(req: Request, res: Response, next: NextFunction) {
    try {
      const features = await FeatureModel.getAllWithVotes();
      res.status(200).json({ features });
    } catch (error) {
      next(error);
    }
  }

  async createFeature(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, description } = createFeatureSchema.parse(req.body);
      
      // Get user ID from authenticated request
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const userId = req.user.userId;
      
      const feature = await FeatureModel.create(title, description, userId);
      res.status(201).json({ feature, message: 'Feature created successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      next(error);
    }
  }

  async getFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid feature ID' });
      }

      const feature = await FeatureModel.getById(id);
      if (!feature) {
        return res.status(404).json({ error: 'Feature not found' });
      }

      res.status(200).json({ feature });
    } catch (error) {
      next(error);
    }
  }

  async updateFeature(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid feature ID' });
      }

      // Get user ID from authenticated request
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // First, check if the feature exists and if the user owns it
      const existingFeature = await FeatureModel.getById(id);
      if (!existingFeature) {
        return res.status(404).json({ error: 'Feature not found' });
      }

      // Check if the user is the owner of the feature
      if (existingFeature.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'You can only update your own features' });
      }

      const { title, description } = updateFeatureSchema.parse(req.body);
      
      const feature = await FeatureModel.update(id, title, description);
      if (!feature) {
        return res.status(404).json({ error: 'Feature not found' });
      }

      res.status(200).json({ feature, message: 'Feature updated successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      next(error);
    }
  }

  async deleteFeature(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid feature ID' });
      }

      // Get user ID from authenticated request
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // First, check if the feature exists and if the user owns it
      const existingFeature = await FeatureModel.getById(id);
      if (!existingFeature) {
        return res.status(404).json({ error: 'Feature not found' });
      }

      // Check if the user is the owner of the feature
      if (existingFeature.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'You can only delete your own features' });
      }

      const deleted = await FeatureModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Feature not found' });
      }

      res.status(200).json({ message: 'Feature deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}