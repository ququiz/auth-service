import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  UserRegistrationReqBodyDTO,
  UserRegistrationResDTO,
} from './dtos/user-registration.dto';
import { UsersService } from './users.service';
import { SuccessResponse } from 'src/commons/interfaces';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  public async postUserRegistration(
    @Body() body: UserRegistrationReqBodyDTO,
  ): Promise<SuccessResponse<UserRegistrationResDTO>> {
    const resultData = await this.usersService.postUserRegistration(body);

    return {
      message: 'User registered successfully',
      data: resultData,
    };
  }
}
