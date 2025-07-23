import { query } from '../database/connection';

export interface Feature {
  id: number;
  title: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_username?: string;
  vote_count?: number;
}

export class FeatureModel {
  static async getAllWithVotes(): Promise<Feature[]> {
    const result = await query('SELECT * FROM features_with_votes ORDER BY vote_count DESC, created_at DESC');
    return result.rows;
  }

  static async getById(id: number): Promise<Feature | null> {
    const result = await query(
      'SELECT * FROM features_with_votes WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(title: string, description: string, created_by: number): Promise<Feature> {
    const result = await query(
      'INSERT INTO features (title, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [title, description, created_by]
    );
    return result.rows[0];
  }

  static async update(id: number, title: string, description: string): Promise<Feature | null> {
    const result = await query(
      'UPDATE features SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM features WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}