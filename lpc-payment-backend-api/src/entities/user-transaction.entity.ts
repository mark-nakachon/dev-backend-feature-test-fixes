import { Table, Column, Model, DataType } from 'sequelize-typescript';
import * as _ from 'lodash';

interface UserTransactionJSON {
  id: number;
  userId: number;
  ruleId?: number;
  amount: number;
}

/**
 * User transaction entitty.
 */
@Table({
  tableName: 'lpc_user_transactions',
  underscored: true,
  timestamps: false,
})
export class UserTransaction extends Model<UserTransaction> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  userId: number;

  @Column({ type: DataType.BIGINT })
  ruleId: number;

  @Column({ allowNull: false })
  amount: number;

  toJSON(): UserTransactionJSON {
    const value = _.assign({}, this.get());
    if (_.isNil(value.ruleId)) {
      delete value.ruleId;
    } else {
      value.ruleId = Number(value.ruleId);
    }
    value.id = Number(value.id);
    value.userId = Number(value.userId);
    return value;
  }
}
