import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Page } from '.prisma/client';
// import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class SchedulerService {
  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}
  //

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
        'post_clicks',
        'post_impressions',
        'post_impressions_fan',
        'post_reactions_like_total',
        'post_reactions_love_total',
        'post_reactions_wow_total',
        'post_reactions_haha_total',
        'post_reactions_sorry_total',
        'post_reactions_anger_total',
        'page_fans',
        // 'page_fans_locale',
        // 'page_fans_city',
        // 'page_fans_country',
        'page_fan_adds',
        'page_fan_removes',
        'page_video_views',
        'page_video_complete_views_30s',
        'page_views_total',
        'post_video_avg_time_watched',
        'post_video_views',
      ];

      const batch = pages.map((page) => {
        const searchParams = new URLSearchParams(`${page.pageId}/insights`);
        searchParams.set('metric', metrics.join(','));
        searchParams.set('access_token', page.accessToken);
        searchParams.set('date_preset', 'last_month');

        return {
          method: 'GET',
          relative_url: decodeURIComponent(searchParams.toString()),
        };
      });

      console.log(batch);

      const url = new URL('/page', FACEBOOK_GRAPH_BASE_URL);
      url.searchParams.set('batch', JSON.stringify(batch));

      // const { data } = await lastValueFrom(
      //   this.httpService.post(url.toString()),
      // );

      // console.log(data);

      // const testPayload = plainToInstance(FacebookGraphResponseDto, data);

      // await validateOrReject(testPayload, {
      //   stopAtFirstError: true,
      //   whitelist: true,
      //   forbidUnknownValues: false,
      //   forbidNonWhitelisted: true,
      // });

      // const metricPayload = data.data.flatMap((metric) =>
      //   metric.values.map((value) => ({
      //     metricId: metric.id,
      //     end_time: value.end_time
      //       ? new Date(value.end_time).toISOString()
      //       : undefined,
      //     ...value,
      //   })),
      // );

      // await this.prisma.$transaction(async (db) => {
      //   const page = await db.page.create({
      //     data: { accessToken, pageId },
      //   });
      //   await db.metric.createMany({
      //     data: data.data.map(({ values, ...metric }) => ({
      //       ...metric,
      //       pageId: page.id,
      //     })),
      //     skipDuplicates: true,
      //   });

      //   await db.values.createMany({
      //     data: metricPayload.map((value) => ({
      //       metricId: value.metricId,
      //       value: value.value,
      //     })),
      //     skipDuplicates: true,
      //   });
      // });

      console.log('success');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
      }
      console.log('huhi');
    }
  }

  private paginateData(data: Page[]) {
    const pageSize = 40;
    return Array.from({ length: Math.ceil(data.length / pageSize) }, (_, i) =>
      data.slice(i * pageSize, i * pageSize + pageSize),
    );
  }
}
