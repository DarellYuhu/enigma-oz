import { Page } from '.prisma/client';
import { IsString } from 'class-validator';

export class CreatePageDto implements Partial<Page> {
  @IsString()
  accessToken: string;

  @IsString()
  id: string;
}
