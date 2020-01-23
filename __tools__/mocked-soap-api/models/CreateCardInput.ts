import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class CreateCardInput {
  @XSDElement
  CardCity: string;
  @XSDElement
  CardPostalCode: string;
  @XSDElement
  CustomerId: number;
  @XSDElement
  CustomerNo: string;
  @XSDElement
  EmbossedName: string;
  @XSDElement
  FirstName: string;
  @XSDElement
  InstId: string;
  @XSDElement
  LastName: string;
  @XSDElement
  PinCity: string;
  @XSDElement
  PinPostalCode: string;
  @XSDElement
  ProductId: number;
  @XSDElement
  ShipmentMethodCard: string;
  @XSDElement
  ShipmentMethodPin: string;
  @XSDElement
  AccountNo: string;
  @XSDElement
  AccountNo2: string;
  @XSDElement
  AccountOwner: string;
  @XSDElement
  ActivateFlag: number;
  @XSDElement
  AddrTypeCard: string;
  @XSDElement
  AddrTypePin: string;
  @XSDElement
  AnnualFeeAccountNo: number;
  @XSDElement
  BulkId: number;
  @XSDElement
  CardAddress1: string;
  @XSDElement
  CardAddress2: string;
  @XSDElement
  CardAddress3: string;
  @XSDElement
  CardAddress4: string;
  @XSDElement
  CardAddress5: string;
  @XSDElement
  CardAddress6: string;
  @XSDElement
  CardCountry: string;
  @XSDElement
  CardDeliveryBank: string;
  @XSDElement
  CardDesignNo: number;
  @XSDElement
  CardFlag: string;
  @XSDElement
  CardInfo: string;
  @XSDElement
  ChargeAccountNo: string;
  @XSDElement
  CredLimit: number;
  @XSDElement
  EmbossedName2: string;
  @XSDElement
  Expire: string;
  @XSDElement
  ExtPictureId: string;
  @XSDElement
  FeeMonth: number;
  @XSDElement
  GKIndikator: string;
  @XSDElement
  MakeCheckSts: number;
  @XSDElement
  Note: string;
  @XSDElement
  OrderPurpose: string;
  @XSDElement
  OrderType: string;
  @XSDElement
  PAmounthLengthSp3: number;
  @XSDElement
  PAmounthSp3: number;
  @XSDElement
  PinAddress1: string;
  @XSDElement
  PinAddress2: string;
  @XSDElement
  PinAddress3: string;
  @XSDElement
  PinAddress4: string;
  @XSDElement
  PinAddress5: string;
  @XSDElement
  PinAddress6: string;
  @XSDElement
  PinCountry: string;
  @XSDElement
  PinMethod: string;
  @XSDElement
  PinName: string;
  @XSDElement
  ShipmentDate: string;
  @XSDElement
  SIR: string;
  @XSDElement
  ValidFromDate: string;
}
