import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { UserLoginReqBodyDTO } from './dto/user-login.dto';
import { SuccessResponse } from 'src/commons/interfaces';
import { AuthenticationTokens } from 'src/commons/tokens/jwt.interface';

@Controller('authentications')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Post()
  public async postUserLogin(
    @Body() payload: UserLoginReqBodyDTO,
  ): Promise<SuccessResponse<AuthenticationTokens>> {
    const result = await this.authenticationsService.postUserLogin(payload);

    return {
      message: 'User logged in successfully',
      data: result,
    };
  }
}
