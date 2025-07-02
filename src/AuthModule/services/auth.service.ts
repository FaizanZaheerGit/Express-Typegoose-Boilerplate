/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions */
// TODO: Remove extra encryption layer, and work on accessToken and refreshToken functionality

import { frontEndUrl } from '@config/index';
import { StatusEnums } from '@enums/status.enums';
import { User } from '@user/models/user.model';
import { OtpTokenRepository } from '@auth/repositories/otptokens.repository';
import { ResetTokenRepository } from '@auth/repositories/resettokens.repository';
import * as userService from '@user/services/user.service';
import { AppError } from '@utils/apperror';
import { comparePassword, generateHash } from '@utils/bcrypt';
import { generateToken } from '@utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import { publishEmailEvent, publishSmsEvent } from '@auth/eventemitters/publisher/auth.publisher';
import { EmailSubjects, EmailBodies } from '@utils/email';
import { SmsBodies } from '@utils/sms';
import { IResetTokenRepository } from '@auth/interfaces/resettoken.repository.interface';
import { IOtpTokenRepository } from '@auth/interfaces/otptoken.repository.interface';
import logger from '@utils/logger';

const otpTokenRepository: IOtpTokenRepository = new OtpTokenRepository();
const resetTokenRepository: IResetTokenRepository = new ResetTokenRepository();

export async function login(body: { email: string; password: string }) {
  try {
    const existingUser: User | null = await userService.getUserByEmailWithPassword(body.email);
    if (!existingUser) {
      throw new AppError('Invalid email or password', 400);
    }
    switch (existingUser.status) {
      case StatusEnums.INACTIVE:
      case StatusEnums.ARCHIVED:
        throw new AppError('User is not active. Please contact support', 400);
      case StatusEnums.PENDING:
        throw new AppError('User is not verified. Please verify using OTP', 400);
      default:
        break;
    }
    const validatePassword = await comparePassword(body.password, existingUser['password'] || '');
    if (!validatePassword) {
      throw new AppError('Invalid email or password', 400);
    }
    const encryptedToken = generateToken({ email: body.email });
    delete existingUser['password'];
    return { user: existingUser, token: encryptedToken };
  } catch (error) {
    logger.error({ ...body }, `Error in login service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function forgotPassword(body: { email: string }) {
  const { email } = body;
  try {
    const existingUser: User | null = await userService.getUserByEmailWithPassword(email);
    if (!existingUser) {
      throw new AppError('User does not exist', 404);
    }
    const resetToken = uuidv4();
    await resetTokenRepository.create({ user: existingUser['_id'], token: resetToken });
    const link: string = `${frontEndUrl}/reset-password?id=${String(existingUser['_id'])}&token=${resetToken}`;
    publishEmailEvent({
      recipients: [email],
      subject: EmailSubjects.FORGOT_PASSWORD,
      text: EmailBodies.FORGOT_PASSWORD(existingUser?.name ?? 'User', link),
      html: EmailBodies.FORGOT_PASSWORD(existingUser?.name ?? 'User', link),
    });
    return {};
  } catch (error) {
    logger.error({ ...body }, `Error in Forgot Password Service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function resetPassword(body: { id: string; newPassword: string; token: string }) {
  const { id, newPassword, token } = body;
  try {
    const existingUser: User | null = await userService.getUserById(id);
    if (!existingUser) {
      throw new AppError('User does not exist', 404);
    }
    const existingToken = await resetTokenRepository.getByTokenAndUser(existingUser, token);
    if (!existingToken || existingToken?.isExpired) {
      throw new AppError('Invalid or Expired Token', 400);
    }
    const hashedPassword = await generateHash(newPassword);
    await Promise.all([
      userService.updateUserPasswordById(id, hashedPassword),
      resetTokenRepository.updateTokensExpiryByUserId(
        String(existingUser['_id']),
        true,
      ),
    ]);
    return {};
  } catch (error) {
    logger.error({ ...body }, `Error in Reset Password Service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function sendOtp(body: { id: string }) {
  const { id } = body;
  try {
    const existingUser: User | null = await userService.getUserById(id);
    if (!existingUser) {
      throw new AppError('User does not exist', 404);
    }
    const otpToken = Math.floor(100000 + Math.random() * 900000).toString();
    await Promise.all([
      otpTokenRepository.updateTokensExpiryByUserId(id, true),
      otpTokenRepository.create({ user: existingUser['_id'], token: otpToken }),
    ]);
    publishEmailEvent({
      recipients: [existingUser?.email || ''],
      subject: EmailSubjects.SEND_OTP,
      text: EmailBodies.SEND_OTP(existingUser?.name ?? 'User', otpToken),
      html: EmailBodies.SEND_OTP(existingUser?.name ?? 'User', otpToken),
    });
    if (existingUser?.phoneNumber) {
      publishSmsEvent({
        recipients: [existingUser?.phoneNumber || ''],
        body: SmsBodies.SEND_OTP(otpToken),
      });
    }
    return {};
  } catch (error) {
    logger.error({ ...body }, 'Error in send OTP Service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function verifyOtp(body: { id: string; token: string }) {
  const { id, token } = body;
  try {
    const existingUser: User | null = await userService.getUserById(id);
    if (!existingUser) {
      throw new AppError('User does not exist', 404);
    }
    const existingOtp = await otpTokenRepository.getByTokenAndUser(existingUser, token);
    if (!existingOtp || existingOtp?.isExpired) {
      throw new AppError('Invalid or Expired Token', 400);
    }
    await Promise.all([
      userService.updateUser(id, { status: StatusEnums.ACTIVE }),
      otpTokenRepository.updateTokensExpiryByUserId(
        String(existingUser['_id']),
        true,
      ),
    ]);
    publishEmailEvent({
      recipients: [existingUser?.email || ''],
      subject: EmailSubjects.VERIFY_OTP,
      text: EmailBodies.VERIFY_OTP(existingUser?.name ?? 'User'),
      html: EmailBodies.VERIFY_OTP(existingUser?.name ?? 'User'),
    });
    return {};
  } catch (error) {
    logger.error({ ...body }, `Error in Verify OTP Service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}
