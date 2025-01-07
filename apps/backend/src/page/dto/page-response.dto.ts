import { ApiProperty } from '@nestjs/swagger';

export class CreatePageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  shortLivedToken: string;

  @ApiProperty()
  longLivedToken: string;

  @ApiProperty()
  isActive: boolean;
}

class Values {
  @ApiProperty()
  end_time: string;

  @ApiProperty()
  value: number;
}

class Metric {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  period: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  pageId: string;

  @ApiProperty({ type: [Values] })
  values: Values[];
}

export class GetPageByIdResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [Metric] })
  metric: Metric[];
}

class Page {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;
}

export class GetAllPageResponseDto {
  @ApiProperty({ type: [Page] })
  data: Page[];

  @ApiProperty()
  statusCode: number;
}
