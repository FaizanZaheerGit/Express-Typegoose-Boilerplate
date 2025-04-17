/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sendResponse } from '@utils/response';
import { nodeEnv, port } from '@config/index';
import { globalErrorHandler } from '@middlewares/error.middleware';
import { mongoDbConnection } from '@database/database.intialization';
import passport from '@middlewares/passport.middleware';
import authRouter from '@auth/routes/auth.routes';
import userRouter from '@user/routes/user.routes';
import { createInitialUser } from '@user/seeders/user.seed';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import '@auth/eventemitters/subscriber/auth.subscriber'; // NOTE: This is for initializing listener

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

void mongoDbConnection(); // NOTE: void added to remove typescript floating promise error
void createInitialUser(); // NOTE: void added to remove typescript floating promise error

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(passport.initialize());
app.use(globalErrorHandler);

if (nodeEnv !== 'production') {
  const specs = YAML.load('./swagger.yaml');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running and listening on port: ${port}`);
});
