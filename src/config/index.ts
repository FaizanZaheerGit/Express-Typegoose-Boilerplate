/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
export const nodeEnv = process.env.NODE_ENV || 'development';
export const mongoDbUri = process.env.MONGODB_URI || '';
export const frontEndUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
export const jwtSecret = process.env.JWT_SECRET || '';
export const saltWorkFactor = process.env.SALT_WORK_FACTOR
  ? parseInt(process.env.SALT_WORK_FACTOR, 10)
  : 10;
export const adminName = process.env.ADMIN_NAME || 'Administrator';
export const adminEmail = process.env.ADMIN_EMAIL || '';
export const adminPassword = process.env.ADMIN_PASSWORD || '';
export const sendGridApiKey = process.env.SENDGRID_API_KEY || '';
export const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL || '';
export const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
export const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
export const twilioFromNumber = process.env.TWILIO_FROM_NUMBER || '';
export const redisHost = process.env.REDIS_HOST;
export const redisPort = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;
export const redisUsername = process.env.REDIS_USERNAME || '';
export const redisPassword = process.env.REDIS_PASSWORD || '';

const envSchema = z.object({
  PORT: z.string().optional().default('5000'),
  NODE_ENV: z.string().optional().default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  FRONTEND_URL: z.string().optional().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  SALT_WORK_FACTOR: z.string().optional().default('10'),
  ADMIN_NAME: z.string().optional().default('Administrator'),
  ADMIN_EMAIL: z.string().min(1, 'ADMIN_EMAIL is required'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
  SENDGRID_API_KEY: z.string().min(1, 'SENDGRID_API_KEY is requried'),
  SENDGRID_FROM_EMAIL: z.string().min(1, 'SENDGRID_FROM_EMAIL is required'),
  TWILIO_ACCOUNT_SID: z.string().min(1, 'TWILIO_ACCOUNT_SID is required'),
  TWILIO_AUTH_TOKEN: z.string().min(1, 'TWILIO_AUTH_TOKEN is required'),
  TWILIO_FROM_NUMBER: z.string().min(1, 'TWILIO_FROM_NUMBER is required'),
  REDIS_HOST: z.string().optional().default(''),
  REDIS_PORT: z.string().optional().default('6379'),
  REDIS_USERNAME: z.string().optional().default(''),
  REDIS_PASSWORD: z.string().optional().default(''),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error({}, 'Invalid environment variables:');
  parsedEnv.error.issues.forEach((issue) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error({}, `${issue?.path}`);
    console.error({}, `- ${issue.message}`);
  });
  process.exit(1);
}

export const config = parsedEnv.data;
