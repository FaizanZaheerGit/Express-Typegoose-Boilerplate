import IoRedis from 'ioredis';
import { redisHost, redisPort, redisUsername, redisPassword } from '@config/index';
import logger from '@utils/logger';

// TODO: Implement a proper structure to initialize redis in a different place and a separate redis service for other functions

export const redisConnection: IoRedis = new IoRedis({
  host: redisHost || 'localhost',
  port: redisPort || 6379,
  username: redisUsername || 'default',
  password: redisPassword || '',
  maxRetriesPerRequest: null,
});

export const getRedisDataByKey = async (key: string): Promise<string | null> => {
  return await redisConnection.get(key);
};

export const setRedisDataByKey = async (
  data: string,
  key: string,
  ttlSeconds?: number,
): Promise<boolean> => {
  try {
    if (ttlSeconds) {
      await redisConnection.set(key, data, 'EX', ttlSeconds);
    } else {
      await redisConnection.set(key, data);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteRedisDataByKey = async (key: string) => {
  try {
    await redisConnection.del(key);
    return true;
  } catch (error) {
    return false;
  }
};

redisConnection.on('connect', () => {
  logger.info({}, 'Redis Connected!');
});

redisConnection.on('error', (err) => {
  logger.info({}, `Error in connecting redis:  ${err.message}`);
});

redisConnection.on('close', () => {
  logger.info({}, `Redis Connection closed successfully!`);
});

redisConnection.on('end', () => {
  logger.info({}, `Redis Connection ended successfully!`);
});

export const closeRedisConnection = async () => {
  await redisConnection.quit();
};
