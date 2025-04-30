/* eslint-disable no-console, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { redisConnection } from '@queues/redis';
import { sendBulkSms } from '@utils/sms';
import { QueueEvents, Worker } from 'bullmq';

export const smsProcessor = new Worker(
  'smsQueue',
  async (job) => {
    console.log(`DATA:  =>  ${JSON.stringify(job?.data)},  NAME:  =>  ${job?.name}`);
    const { recipients, body } = job.data;
    return await sendBulkSms(recipients, body);
  },
  { connection: redisConnection },
);

const smsQueueEvent = new QueueEvents('smsQueue', { connection: redisConnection });

smsQueueEvent.on('active', ({ jobId }) => {
  console.log(`SMS Job with Id: ${jobId} active!`);
});

smsQueueEvent.on('added', ({ jobId }) => {
  console.log(`SMS Job with Id: ${jobId} added!`);
});

smsQueueEvent.on('error', ({ message }) => {
  console.log(`SMS Job Error: ${message} !`);
});

smsQueueEvent.on('waiting', ({ jobId }) => {
  console.log(`SMS Job with Id: ${jobId} waiting!`);
});

smsQueueEvent.on('completed', ({ jobId }) => {
  console.log(`SMS Job with Id: ${jobId} completed!`);
});

smsQueueEvent.on('failed', ({ jobId, failedReason }) => {
  console.log(`SMS Job with id ${jobId}\nReason: ${failedReason}`);
});
