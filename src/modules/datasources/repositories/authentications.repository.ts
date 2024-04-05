import { Injectable } from '@nestjs/common';
import { Authentication } from '../entities/authentications.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthenticationsRepository extends Repository<Authentication> {
  constructor(private readonly dataSource: DataSource) {
    super(Authentication, dataSource.createEntityManager());
  }
}
