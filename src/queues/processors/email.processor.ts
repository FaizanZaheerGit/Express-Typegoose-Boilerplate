/* eslint-disable no-console, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { redisConnection } from '@queues/redis';
import { sendEmails } from '@utils/email';
import { QueueEvents, Worker } from 'bullmq';

export const emailProcessor = new Worker(
  'emailQueue',
  async (job) => {
    console.log(`DATA:  =>  ${JSON.stringify(job?.data)},  NAME:  =>  ${job?.name}`);
    const { recipients, subject, text, html } = job.data;
    return await sendEmails(recipients, subject, text, html);
  },
  { connection: redisConnection },
);

const emailQueueEvent = new QueueEvents('emailQueue', { connection: redisConnection });

emailQueueEvent.on('active', ({ jobId }) => {
  console.log(`Email Job with Id: ${jobId} active!`);
});

emailQueueEvent.on('added', ({ jobId }) => {
  console.log(`Email Job with Id: ${jobId} added!`);
});

emailQueueEvent.on('error', ({ message }) => {
  console.log(`Email Job Error: ${message} !`);
});

emailQueueEvent.on('waiting', ({ jobId }) => {
  console.log(`Email Job with Id: ${jobId} waiting!`);
});

emailQueueEvent.on('completed', ({ jobId }) => {
  console.log(`Email Job with Id: ${jobId} completed!`);
});

emailQueueEvent.on('failed', ({ jobId, failedReason }) => {
  console.log(`Email Job with id ${jobId}\nReason: ${failedReason}`);
});
