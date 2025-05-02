/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { redisConnection } from '@queues/redis';
import { sendEmails } from '@utils/email';
import logger from '@utils/logger';
import { QueueEvents, Worker } from 'bullmq';

export const emailProcessor = new Worker(
  'emailQueue',
  async (job) => {
    logger.info({ data: job?.data, name: job?.name }, `EMAIL PROCESSOR LOG!`);
    const { recipients, subject, text, html } = job.data;
    return await sendEmails(recipients, subject, text, html);
  },
  { connection: redisConnection },
);

const emailQueueEvent = new QueueEvents('emailQueue', { connection: redisConnection });

emailQueueEvent.on('active', ({ jobId }) => {
  logger.debug({ jobId }, `Email Job with Id: ${jobId} active!`);
});

emailQueueEvent.on('added', ({ jobId }) => {
  logger.info({ jobId }, `Email Job with Id: ${jobId} added!`);
});

emailQueueEvent.on('error', ({ message }) => {
  logger.error({ message }, `Email Job Error: ${message} !`);
});

emailQueueEvent.on('waiting', ({ jobId }) => {
  logger.debug({ jobId }, `Email Job with Id: ${jobId} waiting!`);
});

emailQueueEvent.on('completed', ({ jobId }) => {
  logger.info({ jobId }, `Email Job with Id: ${jobId} completed!`);
});

emailQueueEvent.on('failed', ({ jobId, failedReason }) => {
  logger.error({ jobId, failedReason }, `Email Job with id ${jobId}\nReason: ${failedReason}`);
});
