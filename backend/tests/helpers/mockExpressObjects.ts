import { Request, Response, NextFunction } from 'express';

export const createMockRequest = (overrides: any = {}): any => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides
});

export const createMockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = (): NextFunction => {
  return jest.fn();
};

export type MockResponse = {
  status: jest.MockedFunction<any>;
  json: jest.MockedFunction<any>;
  send: jest.MockedFunction<any>;
};