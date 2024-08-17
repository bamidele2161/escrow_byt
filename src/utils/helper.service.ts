import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export class HelperService {
  constructor(private jwtService: JwtService) {}

  generateToken = async (payload: any): Promise<string> => {
    return await this.jwtService.signAsync(payload);
  };

  verifyUserToken = async (token: string, secret: string) => {
    try {
      const result = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      return result;
    } catch (err) {
      throw new UnauthorizedException(
        'Authentification error, please check your token.',
      );
    }
  };

  hasher = async (value: any, salt: number): Promise<string> => {
    return await bcrypt.hash(value, salt);
  };

  async matchChecker(value: any, dbValue: any) {
    let compare = bcrypt.compare(value, dbValue);
    return compare;
  }
}
