import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FacebookModule } from 'src/facebook/facebook.module';

@Module({
  imports: [HttpModule, ConfigModule, FacebookModule],
  controllers: [PageController],
  providers: [PageService, PrismaService],
})
export class PageModule {}
