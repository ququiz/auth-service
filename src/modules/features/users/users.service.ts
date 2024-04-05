import { Injectable } from '@nestjs/common';
import {
  UserRegistrationReqBodyDTO,
  UserRegistrationResDTO,
} from './dtos/user-registration.dto';
import { User } from 'src/modules/datasources/entities/users.entity';
import { hash } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/modules/datasources/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  public async postUserRegistration(
    payload: UserRegistrationReqBodyDTO,
  ): Promise<UserRegistrationResDTO> {
    const { email, username } = payload;

    await this.usersRepository.validateUseDuplicationrByEmailAndUsername(
      email,
      username,
    );

    const newUser = new User();
    newUser.fullname = payload.fullname;
    newUser.email = email;
    newUser.username = username;
    newUser.password = await this.hashPassword(payload.password);

    const addedUser = await this.usersRepository.save(newUser);

    const responseDto = new UserRegistrationResDTO();

    responseDto.user = {
      id: addedUser.id,
    };

    return responseDto;
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, {
      salt: this.configService.get<string>('PASSWORD_SALT'),
    });
  }
}
