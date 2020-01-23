import { Table, Column, Model, DataType } from 'sequelize-typescript';

/**
 * Operation entity.
 */
@Table({
  tableName: 'lpc_operations',
  underscored: true,
  timestamps: false,
})
export class Operation extends Model<Operation> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;
}
