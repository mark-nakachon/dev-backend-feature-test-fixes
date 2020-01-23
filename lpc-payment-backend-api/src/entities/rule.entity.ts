import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Operation } from './operation.entity';
import * as _ from 'lodash';

interface RuleJSON {
  id: number;
  operation: string;
  rule: object;
  reward: number;
}

/**
 * Rule entity.
 */
@Table({
  tableName: 'lpc_rules',
  underscored: true,
  timestamps: false,
})
export class Rule extends Model<Rule> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Operation)
  @Column({ type: DataType.BIGINT, allowNull: false })
  operationId: number;

  @Column({ type: DataType.JSON, allowNull: false })
  rule: object;

  @Column({ allowNull: false })
  reward: number;

  @BelongsTo(() => Operation)
  operation: Operation;

  toJSON(): RuleJSON {
    const value = _.assign({}, this.get());
    if (this.operation) {
      value.operation = this.operation.name;
    }
    value.id = Number(value.id);
    return _.omit(value, 'operationId');
  }
}
