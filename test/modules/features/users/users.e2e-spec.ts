import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { User } from 'src/modules/datasources/entities';
import { UsersRepository } from 'src/modules/datasources/repositories/users.repository';
import { UsersController } from 'src/modules/features/users/users.controller';
import { UsersService } from 'src/modules/features/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(
    async () => {
      postgresContainer = await new PostgreSqlContainer('postgres:16').start();

      const url = postgresContainer.getConnectionUri();

      const appModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          TypeOrmModule.forRoot({
            type: 'postgres',
            url,
            entities: [User],
            synchronize: true,
          }),
          TypeOrmModule.forFeature([User]),
        ],
        providers: [UsersService, UsersRepository],
        controllers: [UsersController],
      }).compile();

      usersRepository = appModule.get<UsersRepository>(UsersRepository);

      app = appModule.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          transformOptions: { enableImplicitConversion: true },
          validateCustomDecorators: true,
        }),
      );

      await app.init();
    },
    1000 * 60 * 5, // 5 minutes timeout for starting the container
  );

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
  });

  describe('POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const payload = {
        fullname: 'John Doe',
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: 'Password1!',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user.id).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {};

      // Act
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('fullname must be a string');
      expect(response.body.message).toContain('email must be an email');
      expect(response.body.message).toContain('username must be a string');
      expect(response.body.message)
        .toContain(`Password should contains at least 1 uppercase, 
    1 lowercase, 1 special char, 1 number and minimal length 8`);
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        email: 123,
        username: null,
        password: 'qwerty',
        fullname: undefined,
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('fullname must be a string');
      expect(response.body.message).toContain('email must be an email');
      expect(response.body.message).toContain('username must be a string');
      expect(response.body.message)
        .toContain(`Password should contains at least 1 uppercase, 
    1 lowercase, 1 special char, 1 number and minimal length 8`);
    });

    it('should response 400 when username already taken', async () => {
      // Arrange
      await usersRepository.save({
        fullname: 'John Doe 1',
        email: 'johndoe1@gmail.com',
        username: 'alreadytaken',
        password: 'Password1!',
      });
      const payload = {
        fullname: 'John Doe 2',
        email: 'johndoe2@gmail.com',
        username: 'alreadytaken',
        password: 'Password2!',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already in use');
    });

    it('should response 400 when email already taken', async () => {
      // Arrange
      await usersRepository.save({
        fullname: 'Foo 1',
        email: 'foo1@gmail.com',
        username: 'foo1',
        password: 'Password1!',
      });
      const payload = {
        fullname: 'Foo 2',
        email: 'foo1@gmail.com',
        username: 'foo2',
        password: 'Password2!',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use');
    });
  });
});
