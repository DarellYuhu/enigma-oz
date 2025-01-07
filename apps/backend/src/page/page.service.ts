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

  findAll() {
    return this.prismaService.page.findMany({
      select: { id: true, name: true, isActive: true },
    });
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
