import { redisConnection } from '@queues/redis';
import { Queue } from 'bullmq';

export const EmailQueue = new Queue('emailQueue', { connection: redisConnection });

export const closeEmailQueueConnection = EmailQueue.close();
