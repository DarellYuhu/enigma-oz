import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FacebookService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private FACEBOOK_GRAPH_BASE_URL = this.configService.get<string>(
    'FACEBOOK_GRAPH_BASE_URL',
  );

  async generateUserLongLivedToken({
    clientId,
    clientSecret,
    shortLivedToken,
  }: GenerateLongLivedTokenParams) {
    const url = new URL('/oauth/access_token', this.FACEBOOK_GRAPH_BASE_URL);
    url.searchParams.set('grant_type', 'fb_exchange_token');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('client_secret', clientSecret);
    url.searchParams.set('fb_exchange_token', shortLivedToken);

    const { data } = await lastValueFrom<
      AxiosResponse<UserLongLivedTokenResponse>
    >(this.httpService.get(url.toString()));

    return data;
  }

  async generatePageLongLivedToken(userId: string, longLivedUserToken: string) {
    const url = new URL(`/${userId}/accounts`, this.FACEBOOK_GRAPH_BASE_URL);
    url.searchParams.set('access_token', longLivedUserToken);
    const { data } = await lastValueFrom<
      AxiosResponse<PageLongLivedTokenResponse>
    >(this.httpService.get(url.toString()));
    return data;
  }
}

type PageLongLivedTokenResponse = {
  data: {
    access_token: string;
    category: string;
    category_list: { id: string; name: string }[];
    name: string;
    id: string;
    tasks: { task: string }[];
  }[];
  paging: { cursors: { before: string; after: string } };
};

type GenerateLongLivedTokenParams = {
  clientId: string;
  clientSecret: string;
  shortLivedToken: string;
};

type UserLongLivedTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: string;
};
