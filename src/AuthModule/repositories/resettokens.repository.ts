import { IResetTokenRepository } from '@auth/interfaces/resettoken.repository.interface';
import { ResetToken, ResetTokenModel } from '@auth/models/resettoken.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { User } from '@user/models/user.model';

export class ResetTokenRepository
  extends BaseRespository<ResetToken>
  implements IResetTokenRepository
{
  constructor() {
    super(ResetTokenModel);
  }

  async createToken(user: any, token: string): Promise<ResetToken> {
    return await this.create({ user, token });
  }

  async getByTokenAndUser(user: User, token: string): Promise<ResetToken | null> {
    return await this.findOne({ user, token });
  }
}
