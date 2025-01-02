import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler/scheduler.service';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { HttpModule } from '@nestjs/axios';
import { PageModule } from './page/page.module';
import { AuthModule } from './auth/auth.module';
import { FacebookService } from './facebook/facebook.service';
import { FacebookModule } from './facebook/facebook.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      expandVariables: true,
      isGlobal: true,
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    PageModule,
    AuthModule,
    FacebookModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SchedulerService, FacebookService],
})
export class AppModule {}
