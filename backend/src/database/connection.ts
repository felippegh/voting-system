import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000'),
});

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (process.env.DB_QUERY_LOGGING === 'true') {
    console.log('Executed query', { text, duration, rows: res.rowCount });
  }
  
  return res;
};

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);
  
  const timeoutMs = parseInt(process.env.DB_QUERY_TIMEOUT_WARNING || '5000');
  const timeout = setTimeout(() => {
    console.error(`A client has been checked out for more than ${timeoutMs}ms!`);
  }, timeoutMs);
  
  // Override query method with proper typing
  client.query = ((text: string, values?: any[]) => {
    clearTimeout(timeout);
    return originalQuery(text, values);
  }) as PoolClient['query'];
  
  // Override release method with proper typing
  client.release = ((err?: Error | boolean) => {
    clearTimeout(timeout);
    return originalRelease(err);
  }) as PoolClient['release'];
  
  return client;
};

export default pool;