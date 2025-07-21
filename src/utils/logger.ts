import pino, { Logger } from 'pino';
import { nodeEnv } from '@config/index';
// TODO: Not working as expected , check log file creation again

const pinoConfig = nodeEnv.toLowerCase() === 'production' ? {
  name: 'customLogger',
  level: 'info',
  base: null,
  transport: {
    target: 'pino/file',
    destination: `logs/log-${new Date().toISOString().split('T')[0]}.log`,
    mkdir: true,
  },
  timestamp: () => `,"timestamp": ${new Date().toISOString()}`,
  messageKey: 'message'
} : {
  name: 'customLogger',
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      singleLine: true,
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
    timestamp: () => `,"timestamp": ${new Date().toISOString()}`,
    messageKey: 'message'
  }
};

const logger: Logger = pino(pinoConfig);

export default logger;
