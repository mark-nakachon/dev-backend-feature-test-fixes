import { User } from '../entities';

export const UsersProvider = {
  provide: 'UsersRepository',
  useValue: User,
};
