import {
  mockUserProvider,
  sequelize,
  mockDataProvider,
  mockTransactionsProvider,
  mockOperationProvider,
  mockRuleProvider,
} from './jest.setup';

import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { TransformInterceptor } from '../src/interceptor/transform.interceptor';
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

  it('create transaction 1 success', async () => {
    const req = {
      userId: 20000,
      ruleId: 10000,
      amount: 100,
    };

    return await request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/points`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(201)
      .expect(d => {
        let ret = d.body;
        expect(ret.id).toBeDefined();
        expect(Number(ret.userId)).toBe(20000);
        expect(Number(ret.ruleId)).toBe(10000);
        expect(Number(ret.amount)).toBe(100);
      });
    // .end(done)
  });

  it('create transaction 2 success', done => {
    const req = {
      userId: 20001,
      ruleId: null,
      amount: 100,
    };

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/points`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(201)
      .expect(d => {
        let ret = d.body;
        expect(ret.id).toBeDefined();
        expect(Number(ret.userId)).toBe(20001);
        expect(ret.ruleId).toBeUndefined();
        expect(Number(ret.amount)).toBe(100);
      })
      .end(done);
  });

  it('create transaction fail user not found', done => {
    const userId = 2000000;

    const req = {
      userId,
      ruleId: 10000,
      amount: 100,
    };

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/points`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(400)
      .expect(d => {
        let ret = d.body;
        expect(ret.message).toBe(`User not found with given id: ${userId}`);
      })
      .end(done);
  });

  it('create transaction fail rule not found', done => {
    const ruleId = 10000000;
    const req = {
      userId: 20000,
      ruleId,
      amount: 100,
    };

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/points`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(400)
      .expect(d => {
        let ret = d.body;
        expect(ret.message).toBe(
          `Loyalty rule not found with given id: ${ruleId}`,
        );
      })
      .end(done);
  });

  it('get transaction success', done => {
    const transactionId = 10000;

    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/points/${transactionId}`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect(d => {
        let ret = d.body;
        expect(Number(ret.userId)).toBe(20000);
        expect(Number(ret.ruleId)).toBe(10000);
        expect(Number(ret.amount)).toBe(100);
      })
      .end(done);
  });

  it('get transaction success', done => {
    const transactionId = -10000;

    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/points/${transactionId}`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(400)
      .expect(d => {
        let error = d.body;
        expect(error.message).toContain('must be a positive integer.');
      })
      .end(done);
  });

  it('get transaction fail not found', done => {
    const id = 100000000000;

    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/points/${id}`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(404)
      .expect(d => {
        let ret = d.body;
        expect(ret.message).toBe(
          `Loyalty points transaction not found with given id: ${id}`,
        );
      })
      .end(done);
  });

  it('buy points success 1', async () => {
    let user: any = await sequelize.models.User.findByPk(20000);
    expect(Number(user.points)).toBe(100);

    return await request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/points/buy`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send({ points: 50 })
      .expect(200)
      .expect(async d => {
        let ret = d.body;

        expect(Number(ret.userId)).toBe(20000);
        //  expect(ret.ruleId).toBeNull();
        expect(Number(ret.amount)).toBe(50);
        user = await sequelize.models.User.findByPk(20000);
        expect(Number(user.points)).toBe(150);
      });
  });

  it('buy points success 2', async () => {
    let user: any = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(100);

    return await request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/points/buy`)
      .set('x-tenant-id', 'abcde12346')
      .set('Authorization', `Bearer ${testToken.token_old_user}`)
      .send({ points: 30 })
      .expect(200)
      .expect(async d => {
        let ret = d.body;
        expect(Number(ret.userId)).toBe(20001);
        // expect(ret.ruleId).toBeUndefined();
        expect(Number(ret.amount)).toBe(30);
        user = await sequelize.models.User.findByPk(20001);
        expect(Number(user.points)).toBe(130);
      });
  });

  it('redeem points success 1', async () => {
    let user: any = await sequelize.models.User.findByPk(20000);
    expect(Number(user.points)).toBe(150);

    return await request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/points/redeem`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send({ points: 15 })
      .expect(200)
      .expect(async d => {
        let ret = d.body;
        expect(Number(ret.userId)).toBe(20000);
        // expect(ret.ruleId).toBeNull();
        expect(Number(ret.amount)).toBe(-15);
        user = await sequelize.models.User.findByPk(20000);
        expect(Number(user.points)).toBe(135);
      });
  });

  it('redeem points success 2', async () => {
    let user: any = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(130);

    return await request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/points/redeem`)
      .set('x-tenant-id', 'abcde12346')
      .set('Authorization', `Bearer ${testToken.token_old_user}`)
      .send({ points: 30 })
      .expect(200)
      .expect(async d => {
        let ret = d.body;
        expect(Number(ret.userId)).toBe(20001);
        // expect(ret.ruleId).toBeNull();
        expect(Number(ret.amount)).toBe(-30);
        user = await sequelize.models.User.findByPk(20001);
        expect(Number(user.points)).toBe(100);
      });
  });

  it('redeem points fail not enough', async () => {
    let user: any = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(100);

    return await request(app.getHttpServer())
      .put(`${BASE_PATH}/loyalty/points/redeem`)
      .set('x-tenant-id', 'abcde12346')
      .set('Authorization', `Bearer ${testToken.token_old_user}`)
      .send({ points: 200 })
      .expect(400)
      .expect(async d => {
        let err = d.body;
        expect(err.message).toBe(`You don't have enough points to redeem.`);
        user = await sequelize.models.User.findByPk(20001);
        expect(Number(user.points)).toBe(100);
      });
  });

  it('transaction connection get transaction error test', async () => {
    jest
      .spyOn(mockDataProvider.useValue, 'transaction')
      .mockImplementationOnce(() => {
        throw Error('intent error');
      });

    const req = {
      userId: 20000,
      ruleId: 10000,
      amount: 100,
    };

    return await request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/points`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(500);
  });

  it('transaction connection  commit error test', async () => {
    let callback = sinon.stub();
    jest
      .spyOn(mockDataProvider.useValue, 'transaction')
      .mockImplementationOnce(() => {
        return {
          commit: () => {
            throw Error('intent commit error');
          },
          rollback: callback,
        };
      });

    const req = {
      userId: 20000,
      ruleId: 10000,
      amount: 100,
    };

    return await request(app.getHttpServer())
      .post(`${BASE_PATH}/loyalty/points`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(500);
  });

  it('searchTransactions success', done => {
    return request(app.getHttpServer())
      .get(`${BASE_PATH}/loyalty/points?page=2&per_page=3`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect('x-page', '2')
      .expect('x-per-page', '3')
      .expect(d => {
        let ret = d.body;
        expect(ret.length).toBe(2);
        expect(Number(ret[0].userId)).toBe(20000);
        expect(Number(ret[0].ruleId)).toBe(10000);
        expect(Number(ret[0].amount)).toBe(100);
        expect(Number(ret[1].userId)).toBe(20001);
        expect(ret[1].ruleId).toBeNull();
        expect(Number(ret[1].amount)).toBe(50);
      })
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
