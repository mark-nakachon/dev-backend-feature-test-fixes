import { stub, replace } from 'sinon';
import { makeMockModels } from 'sequelize-test-helpers';
import * as _ from 'lodash';
import * as seq from 'sequelize-typescript';
import { testRules, testTransactions, testUsers} from "./data.help"


let mockglobId = {
  Rule: 10000,
  User: 20000,
  UserTransaction: 10000,
  Operation: 10000,
};
let userPoints = { '20000': 0, '20001': 0 };


class Base {
  save() {
    
    if (this.constructor.name === 'User') {
      userPoints[this['id']] = this['points'];
    }
    return this;
  }
  update() { return this; }
  destroy() { return null; }
  get() { return this; }
}
class SubBase extends Base {
  id;
  constructor() {
    super();
    
    this.id = mockglobId[this.constructor.name]++;
    if (this.constructor.name === 'UserTransaction') this['ruleId'] = null;
  }
}
class User extends Base {}
class Rule extends Base {}
replace(seq, 'Model', SubBase);  // sequelize.Model mock

let rRule =       { findOne: stub(), save: stub(), findByPk: stub(), findAndCountAll: stub(), destroy: stub()};
let rUser =       { findOne: stub(), save: stub(), findByPk: stub(), findAndCountAll: stub(), destroy: stub()};
let rTrans =      { findOne: stub(), save: stub(), findByPk: stub(), findAndCountAll: stub(), destroy: stub()};
let rOperation =  { findOne: stub(), save: stub(), findByPk: stub(), findAndCountAll: stub(), destroy: stub()};
let models = makeMockModels({
    Rule: rRule,
    Operation: rOperation,
    User: rUser,
    Transaction: rTrans,
  }, 'src/entities', '.ts');

let sequelize: any = {};
sequelize.models = models;
rUser.findOne = async filter => {
  
  let email = _.get(filter, 'where.email');
  if (email === 'test@topcoder.com') {
    return _.assign(new User(),testUsers[0], {
      points: userPoints['20000']
    });
  }

  if (email === 'test123@topcoder.com') {
    return _.assign(new User(), testUsers[1], {
      points: userPoints['20001']
    });
  }

  return null;
};
rUser.findByPk = (uid) => {
  
  if (uid === 20000) {
    return _.assign(new User(),testUsers[0], {
      points: userPoints['20000']
    });
  }
  if (uid === 20001) {
    return _.assign(new User(), testUsers[1], {
      points: userPoints['20001']
    });
  }
  return null;
};

rRule.findByPk = (id, options) => {
  
  if (id === 10000) {
    let r = _.assign(new Rule(), testRules[0]);
    
    return r;
  }

  return null;
};

rRule.findAndCountAll = (...args) => {
  
  return { rows: testRules, count: 7 };
};

rOperation.findOne = (arg: any) => {
  
  let op = _.get(arg, 'where.name');
  if (op === 'operation1') { return { id: 10000, name: 'operation1' }; }
  if (op === 'operation2') { return { id: 10001, name: 'peration2' }; }
  if (op === 'operation3') { return { id: 10002, name: 'peration3' }; }

  return null;
};

rTrans.findByPk = (id) => {
  if (id === 10000) {
    return { id: 10000, userId: 20000, ruleId: 10000, amount: 100 };
  }
};
rTrans.findAndCountAll = () => {
  return { rows: testTransactions, count: 7 };
};

// entity mock provider
let mockRuleProvider = { provide: 'RulesRepository', useValue: models.Rule };
let mockOperationProvider = { provide: 'OperationsRepository', useValue: models.Operation };
let mockUserProvider = { provide: 'UsersRepository', useValue: models.User };
let mockTransactionsProvider = { provide: 'UserTransactionsRepository', useValue: models.Transaction };
let mockDataProvider = {
  provide: 'Sequelize',
  useValue: {
    transaction: () => {
      return {
        rollback: () => {},
        commit: () => {},
      };
    },
  },
};



export {
  mockOperationProvider,
  mockRuleProvider,
  mockUserProvider,
  mockTransactionsProvider,
  mockDataProvider,
  sequelize,
};

