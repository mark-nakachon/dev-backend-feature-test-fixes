import { UserTransaction } from '../entities';

export const UserTransactionsProvider = {
  provide: 'UserTransactionsRepository',
  useValue: UserTransaction,
};
