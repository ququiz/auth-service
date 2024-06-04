import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersRepository } from 'src/modules/datasources/repositories/users.repository';
import { UsersService } from 'src/modules/features/users/users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let configService: ConfigService;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            validateUseDuplicationrByEmailAndUsername: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    app.close;
    jest.clearAllMocks();
  });

  describe('postUserRegistration method', () => {
    it('should orchestrating the user registration action correctly', async () => {
      // Arrange
      const useCasePayload = {
        fullname: 'John Doe',
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: 'Qwerty123!',
      };

      const expectedResult = {
        user: {
          id: 1,
        },
      };

      usersRepository.validateUseDuplicationrByEmailAndUsername = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      usersRepository.save = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ...useCasePayload,
          id: 1,
        }),
      );
      const hashPassword = jest.spyOn(
        UsersService.prototype as any,
        'hashPassword',
      );
      hashPassword.mockImplementation(() => 'encryptedPassword');

      // Act
      const result = await usersService.postUserRegistration(useCasePayload);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(
        usersRepository.validateUseDuplicationrByEmailAndUsername,
      ).toHaveBeenCalledWith(useCasePayload.email, useCasePayload.username);
      expect(hashPassword).toHaveBeenCalledWith(useCasePayload.password);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...useCasePayload,
        password: 'encryptedPassword',
      });
    });
  });
});
