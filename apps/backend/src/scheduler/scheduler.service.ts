import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Page, Prisma } from '.prisma/client';
import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import {
  FacebookGraphResponseDto,
  ValueDto,
} from './dto/facebook-graph-response.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class SchedulerService {
  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  @Cron('*/5 * * * * *', { name: 'getFacebookDataJob' })
  async getFacebookDataJob() {
    try {
      const facebookPages = await this.prisma.page.findMany({
        where: { isActive: true },
      });

      const groups = this.paginateData(facebookPages);

      groups.map((batch) => this.getFacebookData(batch));
    } finally {
      this.schedulerRegistry.deleteCronJob('getFacebookDataJob');
    }
  }

  private async getFacebookData(pages: Page[]) {
    try {
      const FACEBOOK_GRAPH_BASE_URL = this.configService.get<string>(
        'FACEBOOK_GRAPH_BASE_URL',
      );
      const metrics = [
        'page_post_engagements',
        'page_daily_follows',
        'page_follows',
        'page_impressions',
        'page_posts_impressions',
        'page_fans',
        'page_fan_adds',
        'page_fan_removes',
        'page_video_views',
        'page_video_complete_views_30s',
        'page_views_total',
        // 'post_clicks',
        // 'post_impressions',
        // 'post_impressions_fan',
        // 'post_reactions_like_total',
        // 'post_reactions_love_total',
        // 'post_reactions_wow_total',
        // 'post_reactions_haha_total',
        // 'post_reactions_sorry_total',
        // 'post_reactions_anger_total',
        // 'page_fans_locale',
        // 'page_fans_city',
        // 'page_fans_country',
        // 'post_video_views',
        // 'post_video_avg_time_watched',
      ];

      const data = await Promise.all(
        pages.map(async (page) => {
          const url = new URL(`/${page.id}/insights`, FACEBOOK_GRAPH_BASE_URL);
          url.searchParams.set('metric', metrics.join(','));
          url.searchParams.set('access_token', page.accessToken);
          url.searchParams.set('date_preset', 'last_7d');
          const { data } = await lastValueFrom<
            AxiosResponse<FacebookGraphResponseDto>
          >(this.httpService.get(url.toString()));

          const testPayload = plainToInstance(FacebookGraphResponseDto, data);

          await validateOrReject(testPayload, {
            stopAtFirstError: true,
            whitelist: true,
            forbidUnknownValues: false,
            forbidNonWhitelisted: true,
          });

          return { ...data, pageId: page.id };
        }),
      );

      const metricPayload: (Prisma.MetricCreateManyInput & {
        values: ValueDto[];
      })[] = data.flatMap((item) =>
        item.data.map((value) => ({
          ...value,
          pageId: item.pageId,
        })),
      );

      const valuePayload: Prisma.ValuesCreateManyInput[] =
        metricPayload.flatMap((item) =>
          item.values.map<Prisma.ValuesCreateManyInput>((value) => ({
            end_time: value.end_time ? new Date(value.end_time) : null,
            value: value.value,
            metricId: item.id,
          })),
        );

      await this.prisma.$transaction(async (db) => {
        await db.metric.createMany({
          data: metricPayload.map(({ values, ...item }) => item),
          skipDuplicates: true,
        });

        await db.values.createMany({
          data: valuePayload,
          skipDuplicates: true,
        });
      });
      console.log('success');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
      }
      console.log(error);
    }
  }

  private paginateData(data: Page[]) {
    const pageSize = 40;
    return Array.from({ length: Math.ceil(data.length / pageSize) }, (_, i) =>
      data.slice(i * pageSize, i * pageSize + pageSize),
    );
  }
}
