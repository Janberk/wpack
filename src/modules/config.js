/**
 * Configuration file used in frontend modules.
 * 
 */
const env = 'development';
const token = env === 'development' ? '72d8dfaf24231c56c29c7b113cea4c81' : '72d8dfaf24231c56c29c7b113cea4c81'; // PROD'119929e00cd0d4e6835ad6eb240d2f47';

const config = {
  env: env,
  host: '127.0.0.1',
  port: 4000,
  api: 'https://my.sevdesk.de/api/v1',
  token: token
};

export { config };
