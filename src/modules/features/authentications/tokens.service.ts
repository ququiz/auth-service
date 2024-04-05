import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';
import { constants } from 'src/commons/constants';
import { TokenPayload } from 'src/commons/tokens/jwt.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public sign(payload: TokenPayload, expiresIn?: string): string {
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_PRIVATE_KEY'),
      algorithm: 'ES256',
      subject: payload.username,
    };

    if (payload.tokenId) options.jwtid = payload.tokenId;

    if (expiresIn) options.expiresIn = expiresIn;
    const accessToken = this.jwtService.sign({}, options);
    return accessToken;
  }

  public async verify(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY'),
        algorithms: ['ES256'],
      });

      return true;
    } catch (err) {
      if (err.name === constants.tokenExpiredError) {
        throw new TokenExpiredError(
          'Token expired. Please refresh the token.',
          new Date(),
        );
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
