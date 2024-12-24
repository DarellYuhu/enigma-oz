import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
// import { UpdatePageDto } from './dto/update-page.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class PageService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(createPageDto: CreatePageDto) {
    const FACEBOOK_GRAPH_BASE_URL = this.configService.get<string>(
      'FACEBOOK_GRAPH_BASE_URL',
    );
    const url = new URL(`/${createPageDto.pageId}`, FACEBOOK_GRAPH_BASE_URL);
    url.searchParams.set('access_token', createPageDto.accessToken);
    const { data } = await lastValueFrom<AxiosResponse<{ name: string }>>(
      this.httpService.get(url.toString()),
    );
    const page = await this.prismaService.page.create({
      data: { name: data.name, ...createPageDto },
    });
    return page;
  }

  findAll() {
    return `This action returns all page`;
  }

  findOne(id: number) {
    return `This action returns a #${id} page`;
  }

  // update(id: number, _updatePageDto: UpdatePageDto) {
  //   return `This action updates a #${id} page`;
  // }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
