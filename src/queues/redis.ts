/* eslint-disable no-console */
import IoRedis from 'ioredis';
import { redisHost, redisPort, redisUsername, redisPassword } from '@config/index';

export const redisConnection: IoRedis = new IoRedis({
  host: redisHost || 'localhost',
  port: redisPort || 6379,
  username: redisUsername || 'default',
  password: redisPassword || '',
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
  console.log('Redis Connected!');
});

redisConnection.on('error', (err) => {
  console.log(`Error in connecting redis:  ${err.message}`);
});
