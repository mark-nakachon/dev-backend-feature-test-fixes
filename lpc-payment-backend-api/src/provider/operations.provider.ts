import { Operation } from '../entities';

export const OperationsProvider = {
  provide: 'OperationsRepository',
  useValue: Operation,
};
