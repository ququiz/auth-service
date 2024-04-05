import { Injectable } from '@nestjs/common';
import {
  UserRegistrationReqBodyDTO,
  UserRegistrationResDTO,
} from './dtos/user-registration.dto';
import { User } from 'src/modules/datasources/entities/users.entity';
import { UsersRepository } from 'src/modules/datasources/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
    newUser.password = payload.password;

    const addedUser = await this.usersRepository.save(newUser);

    const responseDto = new UserRegistrationResDTO();

    responseDto.user = {
      id: addedUser.id,
    };

    return responseDto;
  }
}
