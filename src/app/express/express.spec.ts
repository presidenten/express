import type { Server } from '@src/app/express/express'
import createServer from '@src/app/express/express';

import * as connectionsTrackerModule from './connections-tracker';
const connectionsTracker = connectionsTrackerModule.default;


jest.mock('@src/app/express/routes');
jest.mock('@src/app/express/connections-tracker', () => ({
  getOpenConnections: jest.fn().mockReturnValue(0),
  reset: jest.fn(),
  middleware: jest.fn(),
}));

describe('express server', () => {
  let express: Server;

  beforeAll(() => {
    connectionsTracker.getOpenConnections = () => 0;
    express = createServer();
  });

  describe('graceful shutdown', () => {
    afterEach(() => {
      clearInterval(express.waitForNoConnections);
      jest.useRealTimers();
    });

    it('should close instantly if no connections', async () => {
      express.server.close = jest.fn().mockImplementation(cb => cb());
      await express.shutdown();
      expect(express.server.close).toHaveBeenCalled();
    })

    it('should wait until open connections close', (done) => {
      jest.useFakeTimers();
      connectionsTracker.getOpenConnections = () => 2;
      express.server.close = jest.fn().mockImplementation(cb => cb());

      express.shutdown().then(() => {
        expect(express.server.close).toHaveBeenCalled();
        done();
      });
      jest.advanceTimersByTime(1000);
      connectionsTracker.getOpenConnections = () => 1;
      jest.advanceTimersByTime(2000);
      connectionsTracker.getOpenConnections = () => 0;
      jest.advanceTimersByTime(1000);
    })
  });
});
