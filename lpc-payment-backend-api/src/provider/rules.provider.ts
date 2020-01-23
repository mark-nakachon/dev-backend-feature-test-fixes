import { Rule } from '../entities';

export const RulesProvider = {
  provide: 'RulesRepository',
  useValue: Rule,
};
