import mongoose, { Mongoose } from 'mongoose';
import { mongoDbUri } from '@config/index';
import logger from '@utils/logger';

export const connectToMongo = async (): Promise<Mongoose | void> => {
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

export const closeConnectionToMongo = async () => {
  try {
    await mongoose.connection.close();
    logger.info({}, 'Mongo DB connection closed successfully');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error({}, `Error in closing Mongo connection: ${error}`);
    process.exit(1);
  }
};
