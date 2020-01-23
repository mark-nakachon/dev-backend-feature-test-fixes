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
import { CreateCustomerReq } from '../src/payments/models/create-customer-req.dto';
import { CreateCardReq } from '../src/payments/models/create-card-req.dto';
import { cardReq, customerSucReq } from './data.help';
import { AllExceptionFilter } from '../src/filter/all-exception.filter';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as nock from 'nock';
import * as _ from 'lodash';
import {
  RulesProvider,
  OperationsProvider,
  UserTransactionsProvider,
  UsersProvider,
  DatabaseProvider,
} from '../src/provider';
import * as config from 'config';

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

  it('soap connection error', async () => {
    nock(config['SOAP_URL'], { allowUnmocked: true })
      .filteringPath(/.*/, '/')
      .get('/')
      .reply(404);
    try {
      await request(app.getHttpServer())
        .get(`${BASE_PATH}/payments/history?page=2&per_page=20`)
        .set('x-tenant-id', 'abcde12345')
        .set('Authorization', `Bearer ${testToken.token_user}`);
      nock.restore();
      throw Error('Should throw error');
    } catch (err) {
      nock.restore();
    }
  });

  it('findHistory success', done => {
    return request(app.getHttpServer())
      .get(`${BASE_PATH}/payments/history?page=2&per_page=20`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect('x-page', '2')
      .expect('x-per-page', '20')
      .expect(d => {
        let ret = d.body;
        expect(ret.length).toBe(20);
      })
      .end(done);
  });

  it('findCards without pciMask success', done => {
    return request(app.getHttpServer())
      .get(
        `${BASE_PATH}/payments/cards?page=3&CardId=1111111&CardIdVNo=111111111&CustomerId=111111&Option=1`,
      )
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .expect(200)
      .expect('x-page', '3')
      .expect('x-per-page', '20')
      .expect(d => {
        let ret = d.body;
        expect(ret.length).toBe(20);
      })
      .end(done);
  });

  it('findCards with pciMask success', done => {
    return request(app.getHttpServer())
      .get(`${BASE_PATH}/payments/cards?page=2`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .set('pcimask', 'true')
      .expect(200)
      .expect('x-page', '2')
      .expect('x-per-page', '20')
      .expect(d => {
        let ret = d.body;
        expect(ret.length).toBe(20);
      })
      .end(done);
  });

  it('createCard success', done => {
    const req: CreateCardReq = new CreateCardReq();
    _.assign(req, cardReq);

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/cards`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(200)
      .expect(d => {
        let ret = d.body;
        expect(ret.CardId).toBeDefined();
        expect(ret.CardIdVNo).toBeDefined();
        expect(ret.CardNo).toBeDefined();
        expect(ret.TxAccountNo).toBeDefined();
        expect(ret.VersionNo).toBeDefined();
      })
      .end(done);
  });

  it('createCard fail', done => {
    const req: CreateCardReq = new CreateCardReq();
    _.assign(req, cardReq, { CustomerNo: 'ERROR' });

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/cards`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(400)
      .expect(d => {
        expect(d.body.message).toBe('100: Customer no existed in CAS');
      })
      .end(done);
  });

  it('createCustomer for new user success', done => {
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/customers`)
      .set('x-tenant-id', '12345abcde')
      .set('Authorization', `Bearer ${testToken.token_new_user}`)
      .send(req)
      .expect(201)
      .expect(d => {
        expect(d.body.CustomerId).toBeDefined();
      })
      .end(done);
  });

  it('createCustomer fail, receive error from soap', done => {
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq, { InstId: 'ERROR' });

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/customers`)
      .set('x-tenant-id', 'abcde12346')
      .set('Authorization', `Bearer ${testToken.token_old_user}`)
      .send(req)
      .expect(400)
      .expect(d => {
        expect(d.body.message).toBe('101: Institution not exist in CAS');
      })
      .end(done);
  });

  it('createCustomer for old user success', done => {
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/customers`)
      .set('x-tenant-id', 'abcde12346')
      .set('Authorization', `Bearer ${testToken.token_old_user}`)
      .send(req)
      .expect(201)
      .expect(d => {
        expect(d.body.CustomerId).toBeDefined();
      })
      .end(done);
  });

  it('createCustomer fail, tenant id incorrect', done => {
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/customers`)
      .set('x-tenant-id', '12345abcde')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(400)
      .expect(d => {
        expect(d.body.message).toBe(`User's tenant id is incorrect.`);
      })
      .end(done);
  });

  it('createCustomer fail, conflict', done => {
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);

    return request(app.getHttpServer())
      .post(`${BASE_PATH}/payments/customers`)
      .set('x-tenant-id', 'abcde12345')
      .set('Authorization', `Bearer ${testToken.token_user}`)
      .send(req)
      .expect(409)
      .expect(d => {
        expect(d.body.message).toBe(
          `User has already registered as a customer in NKS`,
        );
      })
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
