import express from "express";
import logger from '@src/app/logger';
import helpers from "@src/app/helpers";

export default (router: express.Router): void => {
  router.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK' });
  });

  router.get('/wait/:time', async (req, res) => {
    const time = +req.params.time;
    logger.debug(`Responding after ${time}s`);
    await helpers.sleep(time*1000);
    res.status(200).send({ waited: `${time}s` });
  });
};
