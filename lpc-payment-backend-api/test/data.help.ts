export const cardReq = {
  CardCity: 'Warszawa',
  CardPostalCode: '00-001',
  CustomerId: 1234,
  CustomerNo: 'XXXXXXXXXXXX',
  EmbossedName: 'string',
  FirstName: 'John',
  InstId: 'XXXXXXXXX',
  LastName: 'Doe',
  PinCity: 'Warszawa',
  PinPostalCode: '00-001',
  ProductId: 1234,
  ShipmentMethodCard: 'R',
  ShipmentMethodPin: 'R',
};

export const customerSucReq = {
  CustomerNo: '180',
  InstId: 'isdxxx',
};

export const customerConfReq = {
  CustomerNo: '1585888',
  InstId: 'isdxxy',
};

export const history = [
  {
    AccountNo: 'a1',
    CardNo: 'c1',
    VersionNo: 'v1',
    EventDate: '2002-01-01',
    EventDetail: 'e1',
    EventInstId: 'ei1',
    EventText: 'et1',
    EventTime: 'ete1',
    TCode: 'tc1',
    UserId: 'u1',
  },
  {
    AccountNo: 'a2',
    CardNo: 'c2',
    VersionNo: 'v1',
    EventDate: '2002-02-02',
    EventDetail: 'e2',
    EventInstId: 'ei2',
    EventText: 'et2',
    EventTime: 'ete2',
    TCode: 'tc2',
    UserId: 'u2',
  },
];

export const cards = [
  { AccountNo: 'a1', AccountOwner: 'ao1', Branch: 'b1', CardId: 1 },
  { AccountNo: 'a2', AccountOwner: 'ao2', Branch: 'b2', CardId: 2 },
];

export const card = {
  CardId: 1,
  CardIdVNo: 10001,
  CardNo: 'c10001',
  TxAccountNo: 2111,
  VersionNo: '1.0',
};

export const postRuleReq = {
  operation: 'operation1',
  rule: {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'greaterThanInclusive',
          value: 100,
        },
      ],
    },
  },
  reward: 100,
};

export const putRuleReq = {
  operation: 'operation2',
  rule: {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'greaterThanInclusive',
          value: 100,
        },
        {
          fact: 'amount',
          operator: 'lessThanInclusive',
          value: 200,
        },
      ],
    },
  },
  reward: 200,
};

export const postOrPutRuleFailReq = {
  operation: 'operation1',
  rule: {
    conditions: {
      invalid: [
        {
          fact: 'amount',
          operator: 'greaterThanInclusive',
          value: 100,
        },
      ],
    },
  },
  reward: 100,
};


export const testRules = [
  {
    operation: 'operation1',
    rule: {
      conditions: {
        all: [
          {
            fact: 'amount',
            operator: 'greaterThanInclusive',
            value: 100,
          },
        ],
      },
    },
    reward: 100,
    operationId: 10000,
    id: 10000,
  },
  {
    operation: 'operation2',
    rule: {
      conditions: {
        all: [
          {
            fact: 'amount',
            operator: 'greaterThanInclusive',
            value: 200,
          },
        ],
      },
    },
    reward: 200,
    operationId: 10001,
    id: 10001,
  },
]

export const testTransactions = [
  {
    id: 10000,
    userId: 20000,
    ruleId: 10000,
    amount: 100,
  },
  {
    id: 10001,
    userId: 20001,
    ruleId: null,
    amount: 50,
  },
]

export const testUsers = [
  {
    id: 20000,
    isAdmin: true,
    tenantId: 'abcde12345',
    email: 'test@topcoder.com',
    username: 'apptest123',
    soapCustomerId: 'xxxxxxx',
  },
  {
    id: 20001,
    isAdmin: false,
    tenantId: 'abcde12346',
    email: 'test123@topcoder.com',
    username: 'apptest125',
  }
]