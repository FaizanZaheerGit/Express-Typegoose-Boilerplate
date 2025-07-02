import { IOtpTokenRepository } from '@auth/interfaces/otptoken.repository.interface';
import { OtpToken, OtpTokenModel } from '@auth/models/otptoken.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { User } from '@user/models/user.model';
import { Types } from 'mongoose';

export class OtpTokenRepository extends BaseRespository<OtpToken> implements IOtpTokenRepository {
  constructor() {
    super(OtpTokenModel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createToken(user: any, token: string): Promise<OtpToken> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return await this.create({ user, token });
  }

  async getByTokenAndUser(user: User, token: string): Promise<OtpToken | null> {
    return await this.findOne({ user, token });
  }

  async updateTokensExpiryByUserId(
    userId: string,
    isExpired: boolean,
  ): Promise<OtpToken | null> {
    return await this.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: { isExpired: isExpired } },
    );
  }
}
