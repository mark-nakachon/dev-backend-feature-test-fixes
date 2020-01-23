import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';
import { AuthGuard } from '../src/auth/auth.guard';
import {
  ValidationPipe,
  INestApplication,
  HttpException,
} from '@nestjs/common';
import { TransformInterceptor } from '../src/interceptor/transform.interceptor';
import { PaymentsService } from '../src/payments/payments.service';
import { CreateCustomerReq } from '../src/payments/models/create-customer-req.dto';
import { CreateCardReq } from '../src/payments/models/create-card-req.dto';
import { GetCardsReq } from '../src/payments/models/get-cards-req.dto';
import { GetHistoryReq } from '../src/payments/models/get-history-req.dto';
import {
  card,
  cards,
  cardReq,
  history,
  customerSucReq,
  customerConfReq,
} from './data.help';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const authGuard: AuthGuard = new AuthGuard();
  const paymentsService = {
    createCustomer: (createCustomerReq: CreateCustomerReq) => {
      if (createCustomerReq.CustomerNo === '1585888') {
        throw new HttpException('Customer already exist', 409);
      } else {
        return { CustomerId: 123456 };
      }
    },
    createCard: (createCardReq: CreateCardReq, pcimask: string) => {
      return card;
    },
    getCards: (getCardsReq: GetCardsReq, pcimask: string) => {
      return {
        currentPage: 1,
        pageSize: 2,
        totalCount: 5,
        data: cards,
      };
    },
    getHistory: (getHistoryReq: GetHistoryReq) => {
      return {
        currentPage: 1,
        pageSize: 2,
        totalCount: 5,
        data: history,
      };
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PaymentsService)
      .useValue(paymentsService)
      .overrideProvider('SequelizeToken')
      .useValue({})
      .compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api/v1');
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalGuards(authGuard);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        skipMissingProperties: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  it('/api/v1/payments/history (GET history 401)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/payments/history')
      .expect(401);
  });
  it('/api/v1/payments/history (GET history 400)', () => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .get('/api/v1/payments/history?page=-1')
      .expect(400);
  });
  it('/api/v1/payments/history (GET history 200)', done => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .get('/api/v1/payments/history?page=1&per_page=2&VersionNo=v1')
      .expect(200)
      .expect('X-Total-Count', '5')
      .expect('X-Page', '1')
      .expect('X-Per-Page', '2')
      .expect(history)
      .end(done);
  });

  it('/api/v1/payments/cards (GET cards 401)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/payments/cards')
      .expect(401);
  });
  it('/api/v1/payments/cards (GET cards 400)', () => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .get('/api/v1/payments/cards?page=1&per_page=2&Option=5')
      .expect(400);
  });
  it('/api/v1/payments/cards (GET cards 200)', done => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .get('/api/v1/payments/cards?page=1&per_page=2')
      .expect(200)
      .expect('X-Total-Count', '5')
      .expect('X-Page', '1')
      .expect('X-Per-Page', '2')
      .expect(cards)
      .end(done);
  });

  it('/api/v1/payments/cards (POST cards 401)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/payments/cards')
      .send(cardReq)
      .expect(401);
  });
  it('/api/v1/payments/cards (POST cards 400)', () => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .post('/api/v1/payments/cards')
      .send({ CardCity: 'card city' })
      .expect(400);
  });
  it('/api/v1/payments/cards (POST cards 200)', done => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .post('/api/v1/payments/cards')
      .send(cardReq)
      .expect(200)
      .expect('X-Total-Count', '5')
      .expect('X-Page', '1')
      .expect('X-Per-Page', '2')
      .expect(cards)
      .end((err, res) => {
        done();
      });
  });

  it('/api/v1/payments/customers (POST customers 401)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/payments/customers')
      .send(customerSucReq)
      .expect(401);
  });
  it('/api/v1/payments/customers (POST customers 400)', () => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .post('/api/v1/payments/customers')
      .send({ CustomerNo: '12345' })
      .expect(400);
  });
  it('/api/v1/payments/customers (POST customers 409)', () => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .post('/api/v1/payments/customers')
      .send(customerConfReq)
      .expect(400);
  });
  it('/api/v1/payments/customers (POST customers 200)', done => {
    jest.spyOn(authGuard, 'canActivate').mockImplementationOnce(() => true);
    return request(app.getHttpServer())
      .post('/api/v1/payments/cards')
      .send(customerSucReq)
      .expect(200)
      .expect('X-Total-Count', '5')
      .expect('X-Page', '1')
      .expect('X-Per-Page', '2')
      .expect(cards)
      .end((err, res) => {
        done();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
