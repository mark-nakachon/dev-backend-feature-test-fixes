import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class GetCardsResult {
  @XSDElement
  AccountNo: string;
  @XSDElement
  AccountOwner: string;
  @XSDElement
  Branch: string;
  @XSDElement
  CardId: number;
  @XSDElement
  CardIdVNo: number;
  @XSDElement
  CustomerId: number;
  @XSDElement
  CustomerNo: string;
  @XSDElement
  ExtAgreementId: string;
  @XSDElement
  AccountBalance: number;
  @XSDElement
  AccountNo2: string;
  @XSDElement
  ActivateFlag: number;
  @XSDElement
  AggreementNo: number;
  @XSDElement
  AvailBalance: number;
  @XSDElement
  AvailCredit: number;
  @XSDElement
  BlockCode: string;
  @XSDElement
  BlockDate: string;
  @XSDElement
  CardNo: string;
  @XSDElement
  CardNo2: string;
  @XSDElement
  CardOrderStatus: string;
  @XSDElement
  CardType: string;
  @XSDElement
  ClosedData: string;
  @XSDElement
  CredLimit: number;
  @XSDElement
  DateCreated: string;
  @XSDElement
  DateLastTx: string;
  @XSDElement
  DebitAccount: string;
  @XSDElement
  EmbossedName: string;
  @XSDElement
  EmbossedName2: string;
  @XSDElement
  Expire: string;
  @XSDElement
  FDK_STS: number;
  @XSDElement
  LoyaltyCardNo: string;
  @XSDElement
  MakeCheckID: number;
  @XSDElement
  MakeCheckSts: number;
  @XSDElement
  PaymentScheme: string;
  @XSDElement
  ProductId: number;
  @XSDElement
  ProductName: string;
  @XSDElement
  ProductTypeName: string;
  @XSDElement
  RecId: number;
  @XSDElement
  ReferenceAccount: string;
  @XSDElement
  Replaced: boolean;
  @XSDElement
  SIR: string;
  @XSDElement
  Status: string;
  @XSDElement
  SuspAmount: number;
  @XSDElement
  Tokenized: boolean;
  @XSDElement
  TxAccountNo: number;
  @XSDElement
  UpperAccountAvailCredit: number;
  @XSDElement
  UpperAccountBalance: string;
  @XSDElement
  UpperAccountCredLimit: number;
  @XSDElement
  VersionNo: string;
}
