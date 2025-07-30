/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/restrict-template-expressions */
import logger from '@utils/logger';
import { closeConnectionToMongo } from '@database/database.intialization';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import type { Server } from 'http';

interface ShutdownOptions {
  server: Server;
  redisClient?: Redis;
  queues?: Queue[];
}

export const setupGracefulShutdown = ({
  server,
  redisClient,
  queues = [],
}: ShutdownOptions) => {
  const shutdown = async () => {
    logger.warn({}, 'Graceful shutdown initiated...');

    try {
      logger.warn({}, 'Closing MongoDB Connection...');
      await closeConnectionToMongo();
      logger.info({}, 'MongoDB connection closed successfully');

      for (const queue of queues) {
        logger.warn({}, `Closing ${queue.name} Queue...`);
        await queue.close();
        logger.info({}, `${queue.name} Queue closed successfully`);
      }

      if (redisClient) {
        logger.warn({}, 'Closing MongoDB Connection...');
        await redisClient.quit();
        logger.info({}, 'Redis connection closed successfully');
      }

      server.close(() => {
        logger.info({}, 'Express server closed successfully');
        process.exit(0);
      });
    } catch (err) {
      logger.error({}, `Error while performing graceful shutdown:  ${err}`);
      process.exit(1);
    }
  };

  // Bind shutdown to system signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('uncaughtException', shutdown);
  process.on('unhandledRejection', shutdown);
};
