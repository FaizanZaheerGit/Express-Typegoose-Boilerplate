import { jwtSecret } from '@config/index';
import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStategy, ExtractJwt } from 'passport-jwt';
import { decryptToken } from '@utils/jwt';
import { UserRepository } from '@user/repositories/user.repository';
import { AppError } from '@utils/apperror';
import { IUserRepository } from '@user/interfaces/user.repository.interface';
import logger from '@utils/logger';

const userRepository: IUserRepository = new UserRepository();

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req?.headers?.authorization) {
    const encryptedToken = req.headers.authorization.split(' ')[1];
    try {
      token = decryptToken(encryptedToken);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.error({}, `${error}`);
      throw new AppError('Invalid token', 400);
    }
  }
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: jwtSecret,
};

passport.use(
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  new JwtStategy(opts, async (payload, done) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const user = await userRepository.getUserByEmail(payload.email);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error, false);
    }
  }),
);

export default passport;
