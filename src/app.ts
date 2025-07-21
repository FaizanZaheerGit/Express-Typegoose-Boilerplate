/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sendResponse } from '@utils/response';
import { nodeEnv, port } from '@config/index';
import { globalErrorHandler } from '@middlewares/error.middleware';
import { connectToMongo } from '@database/database.intialization';
import passport from '@middlewares/passport.middleware';
import authRouter from '@auth/routes/auth.routes';
import userRouter from '@user/routes/user.routes';
// import { createInitialUser } from '@user/seeders/user.seed';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import '@auth/eventemitters/subscriber/auth.subscriber'; // NOTE: This is for initializing listener
import logger from '@utils/logger';
import roleRouter from '@roles/routes/role.routes';
// import { createInitialRoles } from '@roles/seeders/role.seed';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // NOTE: how long request should be remembered, currently set to 15 minutes
  limit: 100, // NOTE: Limit each IP to a specfic number of requests per windowMs, currently set to 100 requests
  headers: true, // NOTE: boolean to specify whether X-Rate-Limit header is to be sent
  statusCode: 429, // NOTE: In case of too many requests what status code to send, by default its 429
  message: 'Too many requests, please try again later', // NOTE: Optional message string to show if too many requests made
});

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/healthCheck', (req: Request, res: Response, next: NextFunction) => {
  try {
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
});

void connectToMongo();
// createInitialUser(); // TODO: call this function inside cli prompt solution, and remove from calling on app run
// createInitialRoles(); // TODO: call this function inside cli prompt solution, and remove from calling on app run

app.use('/api/v1/auth', limiter, authRouter); // NOTE: Only added rate limiting in un-authenticated routes right now
app.use('/api/v1/users', userRouter);
app.use('/api/v1/roles', roleRouter);

app.use(passport.initialize());
app.use(globalErrorHandler);

if (nodeEnv.toLowerCase() !== 'production') {
  const specs = YAML.load('./swagger.yaml');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
}

app.listen(port, () => {
  logger.info({}, `Server is running and listening on PORT: ${port}`);
});
