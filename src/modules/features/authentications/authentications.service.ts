import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { AuthenticationsRepository } from 'src/modules/datasources/repositories/authentications.repository';
import { UserLoginReqBodyDTO } from './dto/user-login.dto';
import { UsersRepository } from 'src/modules/datasources/repositories/users.repository';
import {
  AuthenticationTokens,
  TokenPayload,
} from 'src/commons/tokens/jwt.interface';
import { TokensService } from './tokens.service';
import { constants } from 'src/commons/constants';
import { UserLogoutReqBodyDTO } from './dto/user-logout.dto';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokensService: TokensService,
    private readonly authenticationsRepository: AuthenticationsRepository,
  ) {}

  public async postUserLogin(
    payload: UserLoginReqBodyDTO,
  ): Promise<AuthenticationTokens> {
    const { username, password } = payload;

    const user = await this.usersRepository.findOneBy({ username });

    if (!user) throw new UnauthorizedException('Invalid username or password');

    await this.comparePassword(password, user.password);

    const newAuthentication = this.authenticationsRepository.create();
    newAuthentication.user = user;

    const result = await this.authenticationsRepository.save(newAuthentication);

    const tokenPayload: TokenPayload = {
      username,
      userId: user.id,
      tokenId: result.id,
    };

    return this.generateAuthenticationTokens(tokenPayload);
  }

  public async deleteUserLogout(payload: UserLogoutReqBodyDTO): Promise<void> {
    const { refreshToken } = payload;
    await this.tokensService.verifyRefreshToken(refreshToken);

    const tokenPayload = await this.tokensService.decodePayload(refreshToken);

    await this.authenticationsRepository.delete({ id: tokenPayload.jti! });
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatch = await verify(hashedPassword, password);

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid username or password');
  }

  private async generateAuthenticationTokens(
    payload: TokenPayload,
  ): Promise<AuthenticationTokens> {
    const accessToken = this.tokensService.signAccessToken(
      payload.username,
      constants.accessTokenExpirationTime,
    );

    const refreshToken = this.tokensService.signRefreshToken(
      payload.userId,
      payload.tokenId,
      constants.refreshTokenExpirationTime,
    );

    return { accessToken, refreshToken };
  }
}
