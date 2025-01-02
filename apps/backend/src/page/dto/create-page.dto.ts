import { IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  appScopedUserId: string;

  @IsString()
  shortLivedToken: string;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;
}
