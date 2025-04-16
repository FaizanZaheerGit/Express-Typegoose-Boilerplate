import { IOtpTokenRepository } from '@auth/interfaces/otptoken.repository.interface';
import { OtpToken, OtpTokenModel } from '@auth/models/otptoken.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { User } from '@user/models/user.model';

export class OtpTokenRepository extends BaseRespository<OtpToken> implements IOtpTokenRepository {
  constructor() {
    super(OtpTokenModel);
  }

  async createToken(user: any, token: string): Promise<OtpToken> {
    return await this.create({ user, token });
  }

  async getByTokenAndUser(user: User, token: string): Promise<OtpToken | null> {
    return await this.findOne({ user, token });
  }
}
