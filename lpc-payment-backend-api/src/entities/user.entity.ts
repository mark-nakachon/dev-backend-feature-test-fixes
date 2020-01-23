import { Table, Column, Model, DataType } from 'sequelize-typescript';

/**
 * User entity.
 */
@Table({
  tableName: 'lpc_users',
  underscored: true,
  timestamps: false,
})
export class User extends Model<User> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(64), allowNull: false })
  tenantId: string;

  @Column({ type: DataType.STRING(45), unique: true })
  soapCustomerId: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  username: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: false })
  isAdmin: boolean;

  @Column({ allowNull: false })
  points: number;
}
