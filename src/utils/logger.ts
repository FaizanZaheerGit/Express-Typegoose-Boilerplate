import pino, { Logger } from 'pino';
import { nodeEnv } from '@config/index';
import path from 'path';

const logger: Logger = pino({
  name: 'customLogger',
  transport: {
    ...(nodeEnv !== 'production' ? { target: 'pino-pretty' } : { target: 'pino/file' }),
    options: {
      ...(nodeEnv == 'production'
        ? { destination: path.join(__dirname, '../logs/app.log'), mkdir: true, sync: false }
        : {}),
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
    level: nodeEnv == 'production' ? 'info' : 'debug',
  },
  timestamp: () => `,"timestamp": ${new Date().toISOString()}`,
  messageKey: 'message',
});

export default logger;
