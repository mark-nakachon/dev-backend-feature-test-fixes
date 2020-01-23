import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { User, UserTransaction, Rule } from '../entities';
import { PageDto } from '../utils/utils.dto';
import { findByPk } from '../utils/sequelize.help';
import { SearchTransactionsReq, PostTransactionReq } from './models';
import * as _ from 'lodash';

/**
 * A service to operate loyalty points transactions.
 */
@Injectable()
export class LoyaltyPointsService {
  constructor(
    @Inject('RulesRepository') private rulesRepository: typeof Rule,
    @Inject('UsersRepository') private usersRepository: typeof User,
    @Inject('UserTransactionsRepository')
    private userTransactionsRepository: typeof UserTransaction,
    @Inject('Sequelize') private sequelize: Sequelize,
  ) {}

  /**
   * Gets a list of loyalty points transactions.
   *
   * @param searchTransactionsReq search loyalty points transactions request
   *
   * @returns loyalty points transactions data with pagination info
   */
  async searchTransactions(
    searchTransactionsReq: SearchTransactionsReq,
  ): Promise<PageDto<UserTransaction[]>> {
    const result = await this.userTransactionsRepository.findAndCountAll({
      order: [['id', 'ASC']],
      limit: searchTransactionsReq.per_page,
      offset: (searchTransactionsReq.page - 1) * searchTransactionsReq.per_page,
    });

    return new PageDto<UserTransaction[]>(
      result.rows,
      result.count,
      null,
      searchTransactionsReq.page,
      searchTransactionsReq.per_page,
    );
  }

  /**
   * Create a loyalty points transaction.
   *
   * @param postTransactionReq create loyalty points transaction info
   *
   * @returns the loyalty points transaction to be created
   */
  async createTransaction(
    postTransactionReq: PostTransactionReq,
  ): Promise<UserTransaction> {
    const user: User = await findByPk(
      'User',
      this.usersRepository,
      postTransactionReq.userId,
    );

    if (postTransactionReq.ruleId) {
      await findByPk(
        'Loyalty rule',
        this.rulesRepository,
        postTransactionReq.ruleId,
      );
    }

    return await this.create(
      user,
      postTransactionReq.amount,
      postTransactionReq.ruleId,
    );
  }

  /**
   * Get loyalty points transaction by id.
   *
   * @param transactionId the transaction id
   *
   * @returns the loyalty ponits transaction with given id
   */
  async get(transactionId: number): Promise<UserTransaction> {
    return await findByPk(
      'Loyalty points transaction',
      this.userTransactionsRepository,
      transactionId,
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * Modify points for a user.
   *
   * @param user the user
   * @param points the points number
   *
   * @returns the loyalty points transaction represent this modification.
   */
  async modifyPoints(user: User, points: number): Promise<UserTransaction> {
    if (points < 0 && user.points + points < 0) {
      throw new HttpException(
        `You don't have enough points to redeem.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.create(user, points);
  }

  /**
   * Create a user transaction and update the user's points
   *
   * @param user the user
   * @param amount the transaction amount
   * @param ruleId the rule id
   *
   * @returns the created loyalty points transaction entity.
   */
  async create(
    user: User,
    amount: number,
    ruleId?: number,
  ): Promise<UserTransaction> {
    let transaction: Transaction;

    try {
      // get transaction
      transaction = await this.sequelize.transaction();

      const userTransaction = new UserTransaction();
      userTransaction.amount = amount;
      userTransaction.userId = user.id;
      if (ruleId) {
        userTransaction.ruleId = ruleId;
      }
      const result = await userTransaction.save();

      user.points = user.points + amount;
      await user.save();

      // commit
      await transaction.commit();

      return result;
    } catch (err) {
      // Rollback transaction only if the transaction object is defined
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  }
}
