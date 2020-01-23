import {
  mockUserProvider,
  sequelize,
  mockDataProvider,
  mockTransactionsProvider,
  mockOperationProvider,
  mockRuleProvider,
} from '../../test/jest.setup';

import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { PageDto } from 'src/utils/utils.dto';
import { User, UserTransaction } from '../entities';
import * as sinon from 'sinon';

describe('LoyaltyPoints Controller', () => {
  let controller: LoyaltyPointsController;
  let transactionId: number = 10000;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyPointsController],
      providers: [
        LoyaltyPointsService,
        mockOperationProvider,
        mockRuleProvider,
        mockTransactionsProvider,
        mockUserProvider,
        mockDataProvider,
      ],
    }).compile();

    controller = module.get<LoyaltyPointsController>(LoyaltyPointsController);
  });

  afterAll(async () => {});

  it('create transaction 1 success', async () => {
    const ret: UserTransaction = await controller.create({
      userId: 20000,
      ruleId: 10000,
      amount: 100,
    });

    expect(ret.id).toBeDefined();
    expect(Number(ret.userId)).toBe(20000);
    expect(Number(ret.ruleId)).toBe(10000);
    expect(Number(ret.amount)).toBe(100);
  });

  it('create transaction 2 success', async () => {
    const ret: UserTransaction = await controller.create({
      userId: 20001,
      ruleId: null,
      amount: 100,
    });
    expect(ret.id).toBeDefined();
    expect(Number(ret.userId)).toBe(20001);
    expect(ret.ruleId).toBeNull();
    expect(Number(ret.amount)).toBe(100);
  });

  it('create transaction fail user not found', async () => {
    const userId = 2000000;
    try {
      await controller.create({
        userId,
        ruleId: 10000,
        amount: 100,
      });
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.message).toBe(`User not found with given id: ${userId}`);
    }
  });

  it('create transaction fail rule not found', async () => {
    const ruleId = 10000000;
    try {
      await controller.create({
        userId: 20000,
        ruleId,
        amount: 100,
      });
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.message).toBe(
        `Loyalty rule not found with given id: ${ruleId}`,
      );
    }
  });

  it('get transaction success', async () => {
    const ret: UserTransaction = await controller.get(transactionId);
    expect(Number(ret.userId)).toBe(20000);
    expect(Number(ret.ruleId)).toBe(10000);
    expect(Number(ret.amount)).toBe(100);
  });

  it('get transaction fail not found', async () => {
    const id = 100000000000;
    try {
      await controller.get(id);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.status).toBe(404);
      expect(err.message).toBe(
        `Loyalty points transaction not found with given id: ${id}`,
      );
    }
  });

  it('buy points success 1', async () => {
    let user: User = await sequelize.models.User.findByPk(20000);
    expect(Number(user.points)).toBe(100);
    const ret: UserTransaction = await controller.buy(user, { points: 50 });
    expect(Number(ret.userId)).toBe(20000);
    expect(ret.ruleId).toBeNull();
    expect(Number(ret.amount)).toBe(50);
    user = await sequelize.models.User.findByPk(20000);
    expect(Number(user.points)).toBe(150);
  });

  it('buy points success 2', async () => {
    let user: User = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(100);
    const ret: UserTransaction = await controller.buy(user, { points: 30 });
    expect(Number(ret.userId)).toBe(20001);
    expect(ret.ruleId).toBeNull();
    expect(Number(ret.amount)).toBe(30);
    user = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(130);
  });

  it('redeem points success 1', async () => {
    let user: User = await sequelize.models.User.findByPk(20000);
    expect(Number(user.points)).toBe(150);
    const ret: UserTransaction = await controller.redeem(user, { points: 15 });
    expect(Number(ret.userId)).toBe(20000);
    expect(ret.ruleId).toBeNull();
    expect(Number(ret.amount)).toBe(-15);
    user = await sequelize.models.User.findByPk(20000);
    expect(Number(user.points)).toBe(135);
  });

  it('redeem points success 2', async () => {
    let user: User = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(130);
    const ret: UserTransaction = await controller.redeem(user, { points: 30 });
    expect(Number(ret.userId)).toBe(20001);
    expect(ret.ruleId).toBeNull();
    expect(Number(ret.amount)).toBe(-30);
    user = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(100);
  });

  it('redeem points fail not enough', async () => {
    let user: User = await sequelize.models.User.findByPk(20001);
    expect(Number(user.points)).toBe(100);
    try {
      await controller.redeem(user, { points: 200 });
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.message).toBe(`You don't have enough points to redeem.`);
      user = await sequelize.models.User.findByPk(20001);
      expect(Number(user.points)).toBe(100);
    }
  });

  it('transaction connection get transaction error test', async () => {
    jest
      .spyOn(mockDataProvider.useValue, 'transaction')
      .mockImplementationOnce(() => {
        throw Error('intent error');
      });

    try {
      await controller.create({
        userId: 20000,
        ruleId: 10000,
        amount: 100,
      });
      throw Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe('intent error');
    }
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

    try {
      await controller.create({
        userId: 20000,
        ruleId: 10000,
        amount: 100,
      });
      throw Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe('intent commit error');
      expect(callback.calledOnce);
    }
  });

  it('searchTransactions success', async () => {
    const ret: PageDto<UserTransaction[]> = await controller.searchTransactions(
      {
        page: 2,
        per_page: 3,
      },
    );
    expect(ret.data.length).toBe(2);
    expect(ret.totalCount).toBe(7);
    expect(ret.totalPage).toBeNull();
    expect(ret.currentPage).toBe(2);
    expect(ret.pageSize).toBe(3);
    expect(Number(ret.data[0].userId)).toBe(20000);
    expect(Number(ret.data[0].ruleId)).toBe(10000);
    expect(Number(ret.data[0].amount)).toBe(100);
    expect(Number(ret.data[1].userId)).toBe(20001);
    expect(ret.data[1].ruleId).toBeNull();
    expect(Number(ret.data[1].amount)).toBe(50);
  });
});
