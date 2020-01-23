import {
  mockUserProvider,
  mockDataProvider,
  mockTransactionsProvider,
  mockOperationProvider,
  mockRuleProvider,
} from './jest.setup';

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { TransformInterceptor } from '../src/interceptor/transform.interceptor';
import { postRuleReq, putRuleReq, postOrPutRuleFailReq } from './data.help';
import { AllExceptionFilter } from '../src/filter/all-exception.filter';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as _ from 'lodash';
import {
  RulesProvider,
  OperationsProvider,
  UserTransactionsProvider,
  UsersProvider,
  DatabaseProvider,
} from '../src/provider';
import { PostOrPutRuleReq, PatchRuleReq } from '../src/loyalty-rules/models';

import { get } from 'config';
let testToken: any = get('TEST_TOKEN');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let BASE_PATH = '/api/v1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseProvider.provide)
      .useValue(mockDataProvider.useValue)
      .overrideProvider(RulesProvider.provide)
      .useValue(mockRuleProvider.useValue)
      .overrideProvider(OperationsProvider.provide)
      .useValue(mockOperationProvider.useValue)
      .overrideProvider(UserTransactionsProvider.provide)
      .useValue(mockTransactionsProvider.useValue)
      .overrideProvider(UsersProvider.provide)
      .useValue(mockUserProvider.useValue)

      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('/api/v1');
    app.useGlobalFilters(new AllExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        validationError: { target: false },
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.use(cors());
    app.use(bodyParser.json({ limit: '2048mb' }));
    app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }));
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  it('create success', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)

      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(201)
      .end(done);
  });

  it('create fail without tenant-id', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(401)
      .expect(d => {
        expect(d.body.message).toBe('Tenant Id is missing');
      })
      .end(done);
  });

  it('create auth fail without token', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .set('Authorization', '')
      .set('x-tenant-id', 'abcde12345')
      .send(req)
      .expect(401)
      .expect(d => {
        expect(d.body.message).toBe('Token is missing');
      })
      .end(done);
  });

  it('create auth fail , not a bear prefix', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Snake ${testToken.token_user}`)
      .send(req)
      .expect(401)
      .expect(d => {
        expect(d.body.message).toBe('Invalid token: Token is not Bearer JWT');
      })
      .end(done);
  });

  it('create auth fail , expired token', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user + 'error'}`)
      .send(req)
      .expect(401)
      .end(done);
  });

  it('create auth fail , User not found', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_new_user}`)
      .send(req)
      .expect(401)
      .expect(d => {
        expect(d.body.message).toContain('User not found');
      })
      .end(done);
  });

  it('create fail, operation not found', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq, { operation: 'invalid' });
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(400)
      .expect(d =>
        expect(d.body.message).toBe(
          `Operation doesn't exist with given name: invalid`,
        ),
      )
      .end(done);
  });

  it('create fail, rule is invalid', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postOrPutRuleFailReq);
    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/rules`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(400)
      .expect(d =>
        expect(d.body.message).toBe(
          `rule is invalid, reason: "conditions" root must contain a single instance of "all" or "any"`,
        ),
      )
      .end(done);
  });

  it('get success', done => {
    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/rules`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .end(done);
  });

  it('get fail', done => {
    const id = 10000000000000;

    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/rules/${id}`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(404)
      .expect(d => {
        expect(d.body.message).toBe(
          `Loyalty rule not found with given id: ${id}`,
        );
      })
      .end(done);
  });

  it('put success', done => {
    const id = 10000;
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, putRuleReq);

    return request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/rules/${id}`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .end(done);
  });

  it('put fail', done => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, putRuleReq);
    const id = 10000000000000;

    return request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/rules/${id}`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(404)
      .expect(d =>
        expect(d.body.message).toBe(
          `Loyalty rule not found with given id: ${id}`,
        ),
      )
      .end(done);
  });

  it('patch success 1', done => {
    const id = 10000;
    const req: PatchRuleReq = new PatchRuleReq();
    _.assign(req, { reward: 500 });

    return request(app.getHttpServer())
      .patch(`${BASE_PATH}/loyalty/rules/${id}`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect(d => {
        expect(Number(d.body.id)).toBe(id);
        expect(Number(d.body.operationId)).toBe(10000);
        expect(d.body.rule).toEqual(postRuleReq.rule);
        expect(d.body.reward).toBe(500);
      })
      .end(done);
  });

  it('patch success 2', done => {
    const req: PatchRuleReq = new PatchRuleReq();
    _.assign(req, { operation: 'operation3' });
    const id = 10000;
    return request(app.getHttpServer())
      .patch(`${BASE_PATH}/loyalty/rules/${id}`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect(d => {
        expect(Number(d.body.id)).toBe(id);
        expect(Number(d.body.operationId)).toBe(10002);
        expect(d.body.rule).toEqual(postRuleReq.rule);
        expect(d.body.reward).toBe(100);
      })
      .end(done);
  });

  it('patch fail', done => {
    const req: PatchRuleReq = new PatchRuleReq();
    _.assign(req, { operation: 'operation1' });
    const id = 10000000000000;
    return request(app.getHttpServer())
      .patch(`${BASE_PATH}/loyalty/rules/${id}`)
      .send(req)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(404)
      .expect(d => {
        expect(d.body.message).toBe(
          `Loyalty rule not found with given id: ${id}`,
        );
      })
      .end(done);
  });

  it('searchRules success', done => {
    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/rules?page=2&per_page=2`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect('x-total-count', '7')
      .expect('x-page', '2')
      .expect('x-per-page', '2')
      .expect(d => {
        let ret = d.body;
        expect(ret.length).toBe(2);
        expect(Number(ret[0].id)).toBe(10000);
        expect(Number(ret[1].id)).toBe(10001);
      })
      .end(done);
  });

  it('delete success', done => {
    const id = 10000;

    return request(app.getHttpServer())
      .delete(`${BASE_PATH}/loyalty/rules/${id}`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(204)
      .end(done);
  });

  it('delete not existed fail', done => {
    const id = 10000;
    return request(app.getHttpServer())
      .delete(`${BASE_PATH}/loyalty/rules/${id + 10}`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(404)
      .expect(d => {
        expect(d.body.message).toBe(
          `Loyalty rule not found with given id: ${id + 10}`,
        );
      })
      .end(done);
  });

  it('delete is not admin fail', done => {
    const id = 10000;
    return request(app.getHttpServer())
      .delete(`${BASE_PATH}/loyalty/rules/${id}`)
      .set('x-tenant-id', 'abcde12346')
      .set('Authorization', `Bearer ${testToken.token_old_user}`)
      .expect(403)
      .expect(d => {
        expect(d.body.message).toBe(
          `Only admin is allowed to perform this operation`,
        );
      })
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
