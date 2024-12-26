import { Type } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ValueDto {
  @IsNumber()
  value: number;

  @IsOptional()
  @IsISO8601()
  end_time?: string;
}

class DataDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  period: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueDto)
  values: ValueDto[];
}

class PagingDto {
  @IsString()
  next: string;

  @IsString()
  previous: string;
}

export class FacebookGraphResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataDto)
  data: DataDto[];

  @IsOptional()
  @IsObject()
  @Type(() => PagingDto)
  @ValidateNested()
  paging?: PagingDto;
}
