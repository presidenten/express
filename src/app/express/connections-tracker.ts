import { Request, Response, NextFunction} from 'express';
import logger from '@src/app/logger';

let openConnections = 0;
export default {
  getOpenConnections(): number { return openConnections; },
  reset(): void { openConnections = 0; },
  middleware(req: Request, res: Response, next: NextFunction): void {
    openConnections++;

    res.on('finish', function() {
      openConnections--;
      openConnections = openConnections < 0 ? 0 : openConnections;
      logger.info(`${req.method}:${req.url} ${res.statusCode}`);
    });

    next();
  },
};
