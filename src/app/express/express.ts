import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import unless from 'express-unless';
import basicAuth from 'express-basic-auth';

import config from '@src/app/config'
import logger from '@src/app/logger';

import addRoutesOn from './routes';
import connectionsTracker from './connections-tracker';

export interface Server {
  app: express.Application;
  server: http.Server;
  shutdown: () => Promise<void>;
  waitForNoConnections: NodeJS.Timeout;
}

export default (): Server => {
  const app = express();
  const { host, port, basePath } = config;
  const router = express.Router();

  app.use(`/${basePath}`, router);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.disable('x-powered-by');

  const { username, password } = config;
  const authMiddleWare = basicAuth({ users: { [username]: password } });

  // @ts-expect-error - becuase it just works that way stupid typescript
  authMiddleWare.unless = unless;
  // @ts-expect-error - becuase it just works that way stupid typescript
  router.use(authMiddleWare.unless({ path: [
    '/health',
    '/health/',
  ]}));
  router.use(connectionsTracker.middleware);
  addRoutesOn(router);

  const server = http.createServer(app);
  if(process.env.NODE_ENV !== 'test') {
    server.listen({ host, port }, () => {
      logger.info(`Server ready at http://${host}:${port}/${basePath}`);
    });
  }

  let waitForNoConnections;
  const shutdown = () => {
    return new Promise<void>((resolve) => {
      logger.info('Server is shutting down...');

      waitForNoConnections = setInterval(async () => {
        logger.debug(`Current connections: ${connectionsTracker.getOpenConnections()}`);
        if (connectionsTracker.getOpenConnections() === 0) {
          clearInterval(waitForNoConnections);
          server.close(() => {
            logger.info('Bye');
            resolve();
          });
        }
      }, 1000);
    })
  }

  return {
    app,
    server,
    shutdown,
    waitForNoConnections,
  };
};

