import { Sequelize } from 'sequelize-typescript';
import { User, UserTransaction, Rule, Operation } from '../entities';
import { get } from 'config';

export const DatabaseProvider = {
  provide: 'Sequelize',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: get('DB_DIALECT'),
      host: get('DB_HOST'),
      port: get('DB_PORT'),
      username: get('DB_USERNAME'),
      password: get('DB_PASSWORD'),
      database: get('DB_DATABASE'),
      logging: false,
    });
    sequelize.addModels([User, UserTransaction, Rule, Operation]);
    return sequelize;
  },
};
