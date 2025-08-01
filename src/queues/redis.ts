import IoRedis from 'ioredis';
import { redisHost, redisPort, redisUsername, redisPassword } from '@config/index';
import logger from '@utils/logger';

export const redisConnection: IoRedis = new IoRedis({
  host: redisHost || 'localhost',
  port: redisPort || 6379,
  username: redisUsername || 'default',
  password: redisPassword || '',
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
  logger.info({}, 'Redis Connected!');
});

redisConnection.on('error', (err) => {
  logger.info({}, `Error in connecting redis:  ${err.message}`);
});

redisConnection.on("close", () => {
  logger.info({}, `Redis Connection closed successfully!`);
});

redisConnection.on("end", () => {
  logger.info({}, `Redis Connection ended successfully!`);
})

export const closeRedisConnection = redisConnection.quit();
