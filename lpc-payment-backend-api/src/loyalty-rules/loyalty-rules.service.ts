import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Rule as RuleObject, RuleProperties } from 'json-rules-engine';
import { Rule, Operation } from '../entities';
import { findByPk } from '../utils/sequelize.help';
import { PageDto } from '../utils/utils.dto';
import { SearchRulesReq, PostOrPutRuleReq, PatchRuleReq } from './models';
import * as _ from 'lodash';

/**
 * A service to operate loyalty rules action.
 */
@Injectable()
export class LoyaltyRulesService {
  constructor(
    @Inject('RulesRepository') private rulesRepository: typeof Rule,
    @Inject('OperationsRepository')
    private operationsRepository: typeof Operation,
  ) {}

  /**
   * Gets a list of loyalty rules.
   *
   * @param searchRulesReq search rule request
   *
   * @returns loyalty rule data with pagination info
   */
  async searchRules(searchRulesReq: SearchRulesReq): Promise<PageDto<Rule[]>> {
    const result = await this.rulesRepository.findAndCountAll({
      order: [['id', 'ASC']],
      include: [Operation],
      limit: searchRulesReq.per_page,
      offset: (searchRulesReq.page - 1) * searchRulesReq.per_page,
    });

    return new PageDto<Rule[]>(
      result.rows,
      result.count,
      null,
      searchRulesReq.page,
      searchRulesReq.per_page,
    );
  }

  /**
   * Find operation by name
   *
   * @param name the operation name
   *
   * @returns the operation
   */
  async findOperation(name: string): Promise<Operation> {
    const op = await this.operationsRepository.findOne({ where: { name } });
    if (_.isNil(op)) {
      throw new HttpException(
        `Operation doesn't exist with given name: ${name}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return op;
  }

  /**
   * Validate the rule object
   *
   * @param rule the rule object
   */
  validateRule(rule: RuleProperties): void {
    if (rule) {
      try {
        // tslint:disable-next-line
        new RuleObject(rule);
      } catch (e) {
        throw new HttpException(
          `rule is invalid, reason: ${e.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * Create or update a loyalty rule
   *
   * @param id the id, if present we need to perform update operation
   * @param data the loyalty rule data info
   *
   * @returns the loyalty rule to be created or updated
   */
  async createOrUpdate(id: number, data: PostOrPutRuleReq): Promise<Rule> {
    this.validateRule(data.rule);
    const rule = id ? await this.get(id, false) : new Rule();
    rule.operation = await this.findOperation(data.operation);
    rule.operationId = rule.operation.id;
    rule.rule = data.rule;
    rule.reward = data.reward;

    return await rule.save();
  }

  /**
   * Create a loyalty rule.
   *
   * @param createRuleReq create loyalty rule info
   *
   * @returns the loyalty rule to be created
   */
  async create(createRuleReq: PostOrPutRuleReq): Promise<Rule> {
    return await this.createOrUpdate(null, createRuleReq);
  }

  /**
   * Get loyalty rule by id.
   *
   * @param ruleId the rule id
   * @param includeOperation the flag indicate whether operation is included
   *
   * @returns the loyalty rule with given id
   */
  async get(ruleId: number, includeOperation: boolean): Promise<Rule> {
    const options: any = {};
    if (includeOperation) {
      options.include = [Operation];
    }
    const rule: Rule = await findByPk(
      'Loyalty rule',
      this.rulesRepository,
      ruleId,
      HttpStatus.NOT_FOUND,
      options,
    );
    return rule;
  }

  /**
   * Fully update loyalty rule by id.
   *
   * @param ruleId the rule id
   * @param updateRuleReq update loyalty rule info
   *
   * @returns the loyalty rule to be updated
   */
  async put(ruleId: number, updateRuleReq: PostOrPutRuleReq): Promise<Rule> {
    return await this.createOrUpdate(ruleId, updateRuleReq);
  }

  /**
   * Partially update loyalty rule by id.
   *
   * @param ruleId the rule id
   * @param patchRuleReq update loyalty rule info
   *
   * @returns the loyalty rule to be updated
   */
  async patch(ruleId: number, patchRuleReq: PatchRuleReq): Promise<Rule> {
    this.validateRule(patchRuleReq.rule);
    let rule: Rule;
    if (patchRuleReq.operation) {
      rule = await this.get(ruleId, false);
      rule.operation = await this.findOperation(patchRuleReq.operation);
      rule.operationId = rule.operation.id;
    } else {
      rule = await this.get(ruleId, true);
    }
    _.assign(rule, _.omit(patchRuleReq, 'operation'));

    return await rule.save();
  }

  /**
   * Delete loyalty rule by id.
   *
   * @param ruleId the rule id
   */
  async delete(ruleId: number): Promise<void> {
    const rule = await this.get(ruleId, false);

    await rule.destroy();
  }
}
