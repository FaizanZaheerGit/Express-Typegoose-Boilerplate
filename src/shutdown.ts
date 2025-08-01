/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/restrict-template-expressions */
import logger from '@utils/logger';
import type { Server } from 'http';
import { closeConnectionToMongo } from '@database/database.intialization';
import { closeEmailQueueConnection } from '@queues/email.queue';
import { closeSmsQueueConnection } from '@queues/sms.queue';
import { closeRedisConnection } from '@queues/redis';

export const setupGracefulShutdown = (server: Server) => {
  const shutdown = async () => {
    logger.warn({}, 'Graceful shutdown initiated...');

    try {
      logger.warn({}, 'Closing MongoDB Connection...');
      await closeConnectionToMongo();
      logger.info({}, 'MongoDB connection closed successfully');

      logger.warn({}, `Closing Email Queue...`);
      await closeEmailQueueConnection;
      logger.info({}, `Email Queue closed successfully`);

      logger.warn({}, `Closing Sms Queue...`);
      await closeSmsQueueConnection;
      logger.info({}, `Sms Queue closed successfully`);

      logger.warn({}, 'Closing Redis Connection...');
      await closeRedisConnection;
      logger.info({}, 'Redis connection closed successfully');

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
