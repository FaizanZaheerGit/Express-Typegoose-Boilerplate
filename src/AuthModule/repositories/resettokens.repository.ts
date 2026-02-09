import { IResetTokenRepository } from '@auth/interfaces/resettoken.repository.interface';
import { ResetToken, ResetTokenModel } from '@auth/models/resettoken.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { User } from '@user/models/user.model';
import { Types } from 'mongoose';

export class ResetTokenRepository
  extends BaseRespository<ResetToken>
  implements IResetTokenRepository
{
  constructor() {
    super(ResetTokenModel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createToken(user: any, token: string): Promise<ResetToken> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return await this.create({ user, token });
  }

  async getByTokenAndUser(user: User, token: string): Promise<ResetToken | null> {
    return await this.findOne({ user, token });
  }

  async updateTokensExpiryByUserId(userId: string, isExpired: boolean): Promise<ResetToken | null> {
    return await this.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: { isExpired: isExpired } },
    );
  }
}
