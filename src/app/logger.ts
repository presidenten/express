import winston from 'winston';
import config from '@src/app/config';

const logFormat = winston.format.printf(function(info) {
  return `date=${new Date().toISOString()} logLevel=${info.level} message=${JSON.stringify(info.message, null, 2)}`;
});

export default winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: config.logLevel,
      format: winston.format.combine(winston.format.colorize(), logFormat),
    })
  ]
});
