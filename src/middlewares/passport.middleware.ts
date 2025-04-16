import { jwtSecret } from '@config/index';
import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStategy, ExtractJwt } from 'passport-jwt';
import { decryptToken } from '@utils/jwt';
import { UserRepository } from '@user/repositories/user.repository';
import { AppError } from '@utils/apperror';
import { IUserRepository } from '@user/interfaces/user.repository.interface';

const userRepository: IUserRepository = new UserRepository();

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req?.headers?.authorization) {
    const encryptedToken = req.headers.authorization.split(' ')[1];
    try {
      token = decryptToken(encryptedToken);
    } catch (error) {
      console.error(error);
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
  new JwtStategy(opts, async (payload, done) => {
    try {
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
