import { query } from '../database/connection';

export interface Vote {
  id: number;
  user_id: number;
  feature_id: number;
  created_at: string;
}

export class VoteModel {
  static async create(userId: number, featureId: number): Promise<Vote> {
    const result = await query(
      'INSERT INTO votes (user_id, feature_id) VALUES ($1, $2) RETURNING *',
      [userId, featureId]
    );
    return result.rows[0];
  }

  static async remove(userId: number, featureId: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM votes WHERE user_id = $1 AND feature_id = $2',
      [userId, featureId]
    );
    return (result.rowCount || 0) > 0;
  }

  static async getByFeature(featureId: number): Promise<Vote[]> {
    const result = await query(
      'SELECT * FROM votes WHERE feature_id = $1',
      [featureId]
    );
    return result.rows;
  }

  static async getCount(featureId: number): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM votes WHERE feature_id = $1',
      [featureId]
    );
    return parseInt(result.rows[0].count);
  }

  static async hasUserVoted(userId: number, featureId: number): Promise<boolean> {
    const result = await query(
      'SELECT 1 FROM votes WHERE user_id = $1 AND feature_id = $2',
      [userId, featureId]
    );
    return result.rows.length > 0;
  }
}