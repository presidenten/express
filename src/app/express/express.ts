import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import unless from 'express-unless';
import basicAuth from 'express-basic-auth';
import { GracefulShutdownManager } from '@moebius/http-graceful-shutdown';

import config from '@src/app/config'
import logger from '@src/app/logger';

import addBasicRoutesOn from './routes/basic';

export interface Server {
  app: express.Application;
  server: http.Server;
  shutdownManager: GracefulShutdownManager,
  shutdown: () => void;
}

export default (): Server => {
  const app = express();
  const { host, port, basePath } = config;
  const router = express.Router();

  app.use(cors());
  app.use(`/${basePath}`, router);
  app.disable('x-powered-by');

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  const { username, password } = config;
  const authMiddleWare = basicAuth({ users: { [username]: password } });
  // @ts-expect-error - becuase it just works that way stupid typescript
  authMiddleWare.unless = unless;
  // @ts-expect-error - becuase it just works that way stupid typescript
  router.use(authMiddleWare.unless({ path: [
    '/health',
    '/health/',
  ]}));

  addBasicRoutesOn(router);

  const server = http.createServer(app);
  const shutdownManager = new GracefulShutdownManager(server);
  if(process.env.NODE_ENV !== 'test') {
    server.listen({ host, port }, () => {
      logger.info(`Server ready at http://${host}:${port}/${basePath}`);
    });
  }

  const shutdown = () => {
    shutdownManager.terminate(() => {
      logger.info('Server is shutting down...');
    });
  };

  return {
    app,
    server,
    shutdownManager,
    shutdown,
  };
};

