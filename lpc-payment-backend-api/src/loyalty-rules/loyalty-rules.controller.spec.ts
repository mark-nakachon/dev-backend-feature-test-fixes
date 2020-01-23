import { mockRuleProvider, mockOperationProvider } from '../../test/jest.setup';

import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyRulesController } from './loyalty-rules.controller';
import { LoyaltyRulesService } from './loyalty-rules.service';
import { PageDto } from 'src/utils/utils.dto';
import { Rule } from '../entities';
import { PatchRuleReq, PostOrPutRuleReq, SearchRulesReq } from './models';
import {
  postRuleReq,
  putRuleReq,
  postOrPutRuleFailReq,
} from '../../test/data.help';
import * as _ from 'lodash';

describe('LoyaltyRules Controller', () => {
  let controller: LoyaltyRulesController;
  let ruleId: number = 10000;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyRulesController],
      providers: [LoyaltyRulesService, mockRuleProvider, mockOperationProvider],
    }).compile();

    controller = module.get<LoyaltyRulesController>(LoyaltyRulesController);
  });

  afterAll(async () => {
    await new Promise(res => setTimeout(() => res(null), 2000));
  });

  it('create success', async () => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq);
    const ret: Rule = await controller.create(req);
    expect(Number(ret.operationId)).toBe(10000);
    expect(ret.rule).toEqual(postRuleReq.rule);
    expect(ret.reward).toEqual(postRuleReq.reward);
  });

  it('create fail, operation not found', async () => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postRuleReq, { operation: 'invalid' });
    try {
      await controller.create(req);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(
        `Operation doesn't exist with given name: invalid`,
      );
    }
  });

  it('create fail, rule is invalid', async () => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, postOrPutRuleFailReq);
    try {
      await controller.create(req);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message.startsWith('rule is invalid, reason')).toBe(true);
    }
  });

  it('get success', async () => {
    const ret: Rule = await controller.get(ruleId);
    expect(Number(ret.operationId)).toBe(10000);
    expect(ret.rule).toEqual(postRuleReq.rule);
    expect(ret.reward).toEqual(postRuleReq.reward);
  });

  it('get fail', async () => {
    const id = 10000000000000;
    try {
      await controller.get(id);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(`Loyalty rule not found with given id: ${id}`);
    }
  });

  it('put success', async () => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, putRuleReq);
    const ret: Rule = await controller.put(ruleId, req);
    expect(Number(ret.id)).toBe(ruleId);
    expect(Number(ret.operationId)).toBe(10001);
    expect(ret.rule).toEqual(putRuleReq.rule);
    expect(ret.reward).toEqual(putRuleReq.reward);
  });

  it('put fail', async () => {
    const req: PostOrPutRuleReq = new PostOrPutRuleReq();
    _.assign(req, putRuleReq);
    const id = 10000000000000;
    try {
      await controller.put(id, req);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(`Loyalty rule not found with given id: ${id}`);
    }
  });

  it('patch success 1', async () => {
    const req: PatchRuleReq = new PatchRuleReq();
    _.assign(req, { reward: 500 });
    const ret: Rule = await controller.patch(ruleId, req);
    expect(Number(ret.id)).toBe(ruleId);
    expect(Number(ret.operationId)).toBe(10000);
    expect(ret.rule).toEqual(postRuleReq.rule);
    expect(ret.reward).toBe(500);
  });

  it('patch success 2', async () => {
    const req: PatchRuleReq = new PatchRuleReq();
    _.assign(req, { operation: 'operation3' });
    const ret: Rule = await controller.patch(ruleId, req);
    expect(Number(ret.id)).toBe(ruleId);
    expect(Number(ret.operationId)).toBe(10002);
    expect(ret.rule).toEqual(postRuleReq.rule);
    expect(ret.reward).toBe(100);
  });

  it('patch fail', async () => {
    const req: PatchRuleReq = new PatchRuleReq();
    _.assign(req, { operation: 'operation1' });
    const id = 10000000000000;
    try {
      await controller.patch(id, req);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(`Loyalty rule not found with given id: ${id}`);
    }
  });

  it('searchRules success', async () => {
    const req: SearchRulesReq = new SearchRulesReq();
    req.page = 2;
    req.per_page = 2;
    const ret: PageDto<Rule[]> = await controller.searchRules(req);
    expect(ret.data.length).toBe(2);
    expect(ret.totalCount).toBe(7);
    expect(ret.totalPage).toBeNull();
    expect(ret.currentPage).toBe(2);
    expect(ret.pageSize).toBe(2);
    expect(Number(ret.data[0].id)).toBe(10000);
    expect(Number(ret.data[1].id)).toBe(10001);
  });

  it('delete success', async () => {
    const result = await controller.delete(ruleId);
    expect(result).toBeUndefined();
  });

  it('delete not existed fail', async () => {
    try {
      await controller.delete(ruleId + 10);
      throw new Error('Should throw error');
    } catch (err) {
      expect(err.message).toBe(
        `Loyalty rule not found with given id: ${ruleId + 10}`,
      );
    }
  });
});
