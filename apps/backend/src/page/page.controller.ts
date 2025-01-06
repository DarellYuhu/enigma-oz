import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AxiosError } from 'axios';
import { Prisma } from '.prisma/client';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CreatePageResponseDto,
  GetPageByIdResponseDto,
} from './dto/page-response.dto';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @ApiCreatedResponse({ type: CreatePageResponseDto })
  @Post()
  async create(@Body() createPageDto: CreatePageDto) {
    try {
      return await this.pageService.create(createPageDto);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        throw new BadRequestException('Invalid Page ID or Access Token');
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('Page Already Exists');
      } else throw error;
    }
  }

  // @Get()
  // findAll() {
  //   return this.pageService.findAll();
  // }

  @ApiOkResponse({ type: GetPageByIdResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') _id: string, @Body() _updatePageDto: UpdatePageDto) {
  //   // return this.pageService.update(+id, updatePageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pageService.remove(+id);
  // }
}
