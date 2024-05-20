import { IsArray, IsUUID } from 'class-validator';

export class GetUserReqDto {
  @IsUUID()
  id: string;
}

export class GetUserByIdsReqDto {
  @IsArray()
  @IsUUID('all', { each: true })
  ids: string[];
}

export class GetUserResDto {
  id: string;
  email: string;
  fullname: string;
  username: string;
}

export class GetUserByIdsResDto {
  users: GetUserResDto[];
}
