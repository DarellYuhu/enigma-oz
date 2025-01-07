import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface ResponseData<T> {
  statusCode: number;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseData<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseData<T>> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: response.statusCode,
      })),
    );
  }
}
