import { redisConnection } from '@queues/redis';
import { Queue } from 'bullmq';

export const SmsQueue = new Queue('smsQueue', { connection: redisConnection });
