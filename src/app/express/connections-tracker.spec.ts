import { Request, Response, NextFunction } from 'express';
import connectionsTracker from './connections-tracker';

describe('connection-tracker', () => {
  describe('middleware', () => {
    afterEach(() => {
      connectionsTracker.reset();
    });

    it('should start empty', () => {
      expect(connectionsTracker.getOpenConnections()).toBe(0);
    });

    it('should keep track of openConnections', () => {
      const req = { body: {} };
      let callback;
      const res = {
        on: (event, cb) => callback = cb,
        statusCode: 200,
      };
      const next = jest.fn();

      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      expect(connectionsTracker.getOpenConnections()).toBe(1);
      callback();
      expect(connectionsTracker.getOpenConnections()).toBe(0);
    });

    it('should keep track of multiple openConnections', () => {
      const req = { body: {} };
      const callback = [];
      const res = {
        on: (event, cb) => callback.push(cb),
        statusCode: 200,
      };
      const next = jest.fn();

      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      expect(connectionsTracker.getOpenConnections()).toBe(3);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(2);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(1);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(0);
    });

    it('should keep track of multiple openConnections going in and out', () => {
      const req = { body: {} };
      const callback = [];
      const res = {
        on: (event, cb) => callback.push(cb),
        statusCode: 200,
      };
      const next = jest.fn();

      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      expect(connectionsTracker.getOpenConnections()).toBe(3);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(2);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(1);

      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      expect(connectionsTracker.getOpenConnections()).toBe(2);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(1);
      (callback.pop())();
      expect(connectionsTracker.getOpenConnections()).toBe(0);
    });

    it('should have negative openConnections', () => {
      const req = { body: {} };
      let callback;
      const res = {
        on: (event, cb) => callback = cb,
        statusCode: 200,
      };
      const next = jest.fn();

      connectionsTracker.middleware(req as Request, res as unknown as Response, next as NextFunction);
      callback();
      callback();
      expect(connectionsTracker.getOpenConnections()).toBe(0);
    });
  });
});
