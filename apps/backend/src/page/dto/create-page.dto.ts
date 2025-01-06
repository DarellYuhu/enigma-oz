import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePageDto {
  @ApiProperty()
  @IsString()
  appScopedUserId: string;

  @ApiProperty()
  @IsString()
  shortLivedToken: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  clientSecret: string;
}
