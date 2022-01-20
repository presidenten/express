import * as moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@src': __dirname,
});

import logger from '@src/app/logger';
import createServer from '@src/app/express/express';

const { shutdown } = createServer();

if (process.env.NODE_ENV !== 'dev') {
  const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signalTraps.forEach((type) => {
    process.once(type, async () => {
      logger.info(`-- Received ${type} --`);
      await shutdown();
    });
  });
}
