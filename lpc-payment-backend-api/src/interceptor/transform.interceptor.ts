import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageDto } from '../utils/utils.dto';
import { Request, Response } from 'express';
import * as url from 'url';

/**
 * Transforme interceptor for PageDto.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, PageDto<T>> {
  /**
   * unwrap the pageDto and set page value to header.
   *
   * @param context nest context
   * @param next call handler
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PageDto<T>> {
    return next.handle().pipe(
      map(data => {
        if (data && (data.totalPage || data.totalCount) && data.data) {
          const ctx = context.switchToHttp();
          const req = ctx.getRequest<Request>();
          const res = ctx.getResponse<Response>();
          if (data.totalCount) {
            res.append('X-Total-Count', data.totalCount.toString());
          }
          res.append('X-Page', data.currentPage.toString());
          res.append('X-Per-Page', data.pageSize.toString());
          res.append(
            'Link',
            this.generateLink(
              req,
              data.totalPage || Math.ceil(data.totalCount / data.pageSize),
              data.currentPage,
            ),
          );
          return data.data;
        } else {
          return data;
        }
      }),
    );
  }

  /**
   * Generates the first, prev, next and last link.
   *
   * @param req http request
   * @param lastPage last page
   * @param currentPage current page
   *
   * @returns the link string
   */
  private generateLink(
    req: Request,
    lastPage: number,
    currentPage: number,
  ): string {
    const query = req.query;
    query.page = 1;
    const first = this.generateLinkUrl(req, query, 'rel="first"');
    const links = [first];

    if (currentPage > 1) {
      query.page = Number(currentPage) - 1;
      const prev = this.generateLinkUrl(req, query, 'rel="prev"');
      links.push(prev);
    }

    if (currentPage < lastPage) {
      query.page = Number(currentPage) + 1;
      const next = this.generateLinkUrl(req, query, 'rel="next"');
      links.push(next);
    }

    query.page = lastPage;
    const last = this.generateLinkUrl(req, query, 'rel="last"');

    return [...links, last].join(', ');
  }

  /**
   * Generates a single link url.
   *
   * @param req http request
   * @param query request query
   * @param rel link rel mark
   *
   * @returns a string of link url
   */
  private generateLinkUrl(req: Request, query: any, rel: string): string {
    return [
      url.format({
        protocol: req.protocol,
        host: req.get('Host'),
        pathname: req.originalUrl.split('?')[0],
        query,
      }),
      rel,
    ].join('; ');
  }
}
