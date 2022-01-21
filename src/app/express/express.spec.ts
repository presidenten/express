import request from 'supertest';
import type { Server } from '@src/app/express/express'
import createServer from '@src/app/express/express';
import config from '@src/app/config';

const { username, password } = config;

describe('express server', () => {
  let express: Server;

  beforeAll(() => {
    express = createServer();
  });

  describe('graceful shutdown', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should close instantly if no connections', async () => {
      express.shutdownManager.terminate = jest.fn();
      await express.shutdown();
      expect(express.shutdownManager.terminate).toHaveBeenCalled();
    });

    it('should wait until open connections close', () => {
      jest.useFakeTimers();

      request(express.app).get(`/wait/1`).auth(username, password);

      express.shutdownManager.terminate = jest.fn();

      express.shutdown();

      expect(express.shutdownManager.terminate).toHaveBeenCalled();
    });
  });
});
