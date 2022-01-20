
export default {
  logLevel: process.env.LOG_LEVEL || 'debug',
  basePath: process.env.BASE_PATH || '',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 3000,
};
