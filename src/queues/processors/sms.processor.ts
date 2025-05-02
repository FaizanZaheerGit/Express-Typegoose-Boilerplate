/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { redisConnection } from '@queues/redis';
import logger from '@utils/logger';
import { sendBulkSms } from '@utils/sms';
import { QueueEvents, Worker } from 'bullmq';

export const smsProcessor = new Worker(
  'smsQueue',
  async (job) => {
    logger.info({ data: job?.data, name: job?.name }, `SMS Processor LOG`);
    const { recipients, body } = job.data;
    return await sendBulkSms(recipients, body);
  },
  { connection: redisConnection },
);

const smsQueueEvent = new QueueEvents('smsQueue', { connection: redisConnection });

smsQueueEvent.on('active', ({ jobId }) => {
  logger.debug({ jobId }, `SMS Job with Id: ${jobId} active!`);
});

smsQueueEvent.on('added', ({ jobId }) => {
  logger.info({ jobId }, `SMS Job with Id: ${jobId} added!`);
});

smsQueueEvent.on('error', ({ message }) => {
  logger.error({ message }, `SMS Job Error: ${message} !`);
});

smsQueueEvent.on('waiting', ({ jobId }) => {
  logger.debug({ jobId }, `SMS Job with Id: ${jobId} waiting!`);
});

smsQueueEvent.on('completed', ({ jobId }) => {
  logger.info({ jobId }, `SMS Job with Id: ${jobId} completed!`);
});

smsQueueEvent.on('failed', ({ jobId, failedReason }) => {
  logger.error({ jobId, failedReason }, `SMS Job with id ${jobId}\nReason: ${failedReason}`);
});
