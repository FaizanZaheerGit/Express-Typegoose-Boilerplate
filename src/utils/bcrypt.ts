import bcrypt from 'bcryptjs';
import { saltWorkFactor } from '@config/index';

export const generateHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltWorkFactor);
};

export const comparePassword = async (
  inputPassword: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, userPassword);
};
