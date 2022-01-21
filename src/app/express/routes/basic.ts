import { Router, Request, Response } from "express";
import cp from 'child_process';
import logger from '@src/app/logger';
import helpers from "@src/app/helpers";

export default (router: Router): void => {
  router.get('/health', (req: Request, res: Response) => {
    res.status(200).send({ status: 'OK' });
  });

  router.get('/wait/:time', async (req: Request, res: Response) => {
    const time = +req.params.time;
    logger.debug(`Responding after ${time}s`);
    await helpers.sleep(time*1000);
    res.status(200).send({ waited: `${time}s` });
  });
};
