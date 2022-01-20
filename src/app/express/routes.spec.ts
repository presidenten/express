import request from 'supertest';

import type { Server } from '@src/app/express/express';

import helpers from '@src/app/helpers';
import createServer from '@src/app/express/express';

jest.mock('@src/app/helpers');

describe('routes', () => {
  let express: Server;

  beforeAll(() => {
    express = createServer();
  });

  describe('/health', () => {
    it('should have a health endpoint', async () => {
      const healthResponse = await request(express.app).get('/health');

      expect(healthResponse.status).toBe(200);
    })
  });

  describe('/wait/:time', () => {
    it('should respond after time seconds', async () => {
      const time = 10;

      const response = await request(express.app).get(`/wait/${time}`);

      expect(helpers.sleep).toHaveBeenCalledWith(time*1000);
      expect(response.status).toBe(200);
    });
  });
});
