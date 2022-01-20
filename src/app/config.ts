
export default {
  logLevel: process.env.LOG_LEVEL || 'debug',
  basePath: process.env.BASE_PATH || '',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 3000,
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'admin',
};
