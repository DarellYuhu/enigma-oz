import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FacebookService } from 'src/facebook/facebook.service';

@Injectable()
export class PageService {
  constructor(
    private prismaService: PrismaService,
    private facebookService: FacebookService,
  ) {}

  async create(createPageDto: CreatePageDto) {
    const { access_token: longLivedUserToken } =
      await this.facebookService.generateUserLongLivedToken({
        ...createPageDto,
      });
    const { data } = await this.facebookService.generatePageLongLivedToken(
      createPageDto.appScopedUserId,
      longLivedUserToken,
    );

    const page = await this.prismaService.page.createMany({
      data: data.map((item) => ({
        ...createPageDto,
        id: item.id,
        name: item.name,
        pageLongLivedToken: item.access_token,
        userLongLivedToken: longLivedUserToken,
      })),
      skipDuplicates: true,
    });
    return page;
  }

  async findAll() {
    const metricsNeed = [
      'page_follows',
      'page_fans',
      'page_post_engagements',
      'page_impressions',
      'page_video_views',
    ];
    // const metrics = await this.prismaService.metric
    //   .groupBy({
    //     by: ['name', 'title', 'description'],
    //     where: {
    //       name: {
    //         in: metricsNeed,
    //       },
    //     },
    //   })
    //   .then((data) =>
    //     Object.fromEntries(data.map((item) => [item.name, item])),
    //   );

    const metrics1 = await this.prismaService.$queryRaw`
      SELECT m."name", SUM(v."value") as value 
      FROM "Metric" as m 
      FULL JOIN "Values" as v ON m."id" = v."metricId" 
      WHERE m."valueType" = 'DAILY'
      GROUP BY m."name" 
      ORDER BY m."name" ASC;
      `.then((data: { name: string; value: bigint }[]) =>
      data
        .filter((item) => metricsNeed.includes(item.name))
        .map((item) => [item.name, Number(item.value)]),
    );

    const metrics2 = await this.prismaService.$queryRaw`
      SELECT m."name", SUM(v."value"), MAX(v."end_time") as value 
      FROM "Metric" as m 
      FULL JOIN "Values" as v ON m."id" = v."metricId" 
      WHERE m."valueType" = 'LIFETIME'
      GROUP BY m."name"
    `.then((data: { name: string; sum: bigint; value: Date }[]) =>
      data
        .filter((item) => metricsNeed.includes(item.name))
        .map((item) => [item.name, Number(item.sum)]),
    );

    const pages = await this.prismaService.page.findMany({
      select: { id: true, name: true, isActive: true },
    });

    return { pages, metrics: Object.fromEntries([...metrics1, ...metrics2]) };
  }

  async findOne(id: string) {
    const page = await this.prismaService.page.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isActive: true,
        Metric: {
          include: {
            Values: { select: { end_time: true, value: true } },
            DemographicValues: { select: { end_time: true, value: true } },
          },
        },
      },
    });
    if (!page) throw new NotFoundException('Page not found');
    const data = {
      ...page,
      Metric: Object.fromEntries(
        page.Metric.map(({ DemographicValues, Values, ...metric }) => [
          metric.name,
          {
            ...metric,
            value: Array.from(
              metric.type === 'DEMOGRAPHIC' ? DemographicValues : Values,
            ),
          },
        ]),
      ),
    };

    return data;
  }

  // update(id: number, _updatePageDto: UpdatePageDto) {
  //   return `This action updates a #${id} page`;
  // }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
