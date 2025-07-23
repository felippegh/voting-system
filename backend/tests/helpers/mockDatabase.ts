// Mock the database connection
export const mockQuery = jest.fn();
export const mockGetClient = jest.fn();

export const mockDbConnection = {
  query: mockQuery,
  getClient: mockGetClient
};

// Helper to create mock query results
export const createMockQueryResult = (rows: any[], rowCount = rows.length) => ({
  rows,
  rowCount,
  command: 'SELECT',
  oid: 0,
  fields: []
});

// Reset all mocks
export const resetDbMocks = () => {
  mockQuery.mockReset();
  mockGetClient.mockReset();
};

// Mock database connection module
jest.mock('./src/database/connection', () => mockDbConnection);