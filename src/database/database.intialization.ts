/* eslint-disable no-console */
import mongoose, { Mongoose } from 'mongoose';
import { mongoDbUri } from '@config/index';

export const mongoDbConnection = async (): Promise<Mongoose | void> => {
  try {
    const db = await mongoose.connect(mongoDbUri);
    console.log(`MongoDB connected at: ${db.connection.host}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
