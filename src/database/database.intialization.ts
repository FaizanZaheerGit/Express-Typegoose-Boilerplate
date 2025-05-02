import mongoose, { Mongoose } from 'mongoose';
import { mongoDbUri } from '@config/index';
import logger from '@utils/logger';

export const mongoDbConnection = async (): Promise<Mongoose | void> => {
  try {
    const db = await mongoose.connect(mongoDbUri);
    logger.info({ mongoDbUri }, `MongoDB connected at: ${db.connection.host}`);
    return db;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error({ mongoDbUri }, `MongoDB connection error: ${error}`);
    process.exit(1);
  }
};
