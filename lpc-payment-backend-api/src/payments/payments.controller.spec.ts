import { mockUserProvider } from '../../test/jest.setup';

import { Test, TestingModule } from '@nestjs/testing';
// import { Sequelize } from 'sequelize-typescript';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PageDto } from 'src/utils/utils.dto';
// import { DatabaseProvider, UsersProvider } from '../provider';
// import { User } from '../entities';

//const nock = require('nock');


import {
  CreateCustomerReq,
  CreateCustomerRes,
  CreateCardReq,
  CreateCardRes,
  GetCardsReq,
  GetCardsRes,
  GetHistoryReq,
  GetHistoryRes,
} from './models';
import { cardReq, customerSucReq } from '../../test/data.help';

import * as _ from 'lodash';

describe('Payments Controller', () => {
  let controller: PaymentsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentsService, mockUserProvider],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  afterAll(async () => {});

  it('findHistory success', async () => {
    const req: GetHistoryReq = new GetHistoryReq();
    req.page = 2;
    const ret: PageDto<GetHistoryRes[]> = await controller.findHistory(req);
    expect(ret.data.length).toBe(20);
    expect(ret.totalCount).toBeNull();
    expect(ret.totalPage).toBe(5);
    expect(ret.currentPage).toBe(2);
    expect(ret.pageSize).toBe(20);
  });

  it('findCards without pciMask success', async () => {
    const req: GetCardsReq = new GetCardsReq();
    req.page = 3;
    const ret: PageDto<GetCardsRes[]> = await controller.findCards(req);
    expect(ret.data.length).toBe(20);
    expect(ret.totalCount).toBeNull();
    expect(ret.totalPage).toBe(5);
    expect(ret.currentPage).toBe(3);
    expect(ret.pageSize).toBe(20);
  });

  it('findCards with pciMask success', async () => {
    const req: GetCardsReq = new GetCardsReq();
    const ret: PageDto<GetCardsRes[]> = await controller.findCards(req, 'true');
    expect(ret.data.length).toBe(20);
    expect(ret.totalCount).toBeNull();
    expect(ret.totalPage).toBe(5);
    expect(ret.currentPage).toBe(1);
    expect(ret.pageSize).toBe(20);
  });

  it('createCard success', async () => {
    const req: CreateCardReq = new CreateCardReq();
    _.assign(req, cardReq);
    const ret: CreateCardRes = await controller.createCard(req);
    expect(ret.CardId).toBeDefined();
    expect(ret.CardIdVNo).toBeDefined();
    expect(ret.CardNo).toBeDefined();
    expect(ret.TxAccountNo).toBeDefined();
    expect(ret.VersionNo).toBeDefined();
  });

  it('createCard fail', async () => {
    const req: CreateCardReq = new CreateCardReq();
    _.assign(req, cardReq, { CustomerNo: 'ERROR' });
    try {
      await controller.createCard(req, 'true');
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe('100: Customer no existed in CAS');
    }
  });

  it('createCustomer for new user success', async () => {
    const tenantId = '12345abcde';
    const email = 'newTest@test.com';
    const username = 'apptest124';
    const cognitoUser = {
      email,
      'cognito:username': username,
    };
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);
    const ret: CreateCustomerRes = await controller.createCustomer(
      req,
      cognitoUser,
      tenantId,
    );
    expect(ret.CustomerId).toBeDefined();
  });

  it('createCustomer fail, receive error from soap', async () => {
    const tenantId = 'abcde12346';
    const email = 'test123@topcoder.com';
    const username = 'apptest125';
    const cognitoUser = {
      email,
      'cognito:username': username,
    };
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq, { InstId: 'ERROR' });
    try {
      await controller.createCustomer(req, cognitoUser, tenantId);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe('101: Institution not exist in CAS');
    }
  });

  it('createCustomer for old user success', async () => {
    const tenantId = 'abcde12346';
    const email = 'test123@topcoder.com';
    const username = 'apptest125';
    const cognitoUser = {
      email,
      'cognito:username': username,
    };
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);
    const ret: CreateCustomerRes = await controller.createCustomer(
      req,
      cognitoUser,
      tenantId,
    );
    expect(ret.CustomerId).toBeDefined();
  });

  it('createCustomer fail, tenant id incorrect', async () => {
    const tenantId = '12345abcde';
    const email = 'test@topcoder.com';
    const username = 'apptest123';
    const cognitoUser = {
      email,
      'cognito:username': username,
    };
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);
    try {
      await controller.createCustomer(req, cognitoUser, tenantId);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(`User's tenant id is incorrect.`);
    }
  });

  it('createCustomer fail, conflict', async () => {
    const tenantId = 'abcde12345';
    const email = 'test@topcoder.com';
    const username = 'apptest123';
    const cognitoUser = {
      email,
      'cognito:username': username,
    };
    const req: CreateCustomerReq = new CreateCustomerReq();
    _.assign(req, customerSucReq);
    try {
      await controller.createCustomer(req, cognitoUser, tenantId);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(
        'User has already registered as a customer in NKS',
      );
    }
  });
});
