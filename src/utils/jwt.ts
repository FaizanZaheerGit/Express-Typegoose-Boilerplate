// TODO: Work on accessToken and refreshToken functionality

import { jwtSecret } from '@config/index';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

const key = crypto.scryptSync(jwtSecret, 'salt', 32);
const algo = 'aes-256-gcm';

export const generateToken = (payload: object): string => {
  const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
  return jwtToken;
};

export const decryptToken = (token: string): string => {
  const [ivHex, authTagHex, encrypted] = token.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algo, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
