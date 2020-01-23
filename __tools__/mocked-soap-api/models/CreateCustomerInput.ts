import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class CreateCustomerInput {
  @XSDElement
  CustomerNo: string;
  @XSDElement
  InstId: string;
  @XSDElement
  AccountList: string;
  @XSDElement
  Address1: string;
  @XSDElement
  Address2: string;
  @XSDElement
  Address3: string;
  @XSDElement
  Address4: string;
  @XSDElement
  Address5: string;
  @XSDElement
  Address6: string;
  @XSDElement
  AltAddress1: string;
  @XSDElement
  AltAddress2: string;
  @XSDElement
  AltAddress3: string;
  @XSDElement
  AltAddress4: string;
  @XSDElement
  AltAddress5: string;
  @XSDElement
  AltAddress6: string;
  @XSDElement
  AltCity: string;
  @XSDElement
  AltCountry: string;
  @XSDElement
  AltPostalCode: string;
  @XSDElement
  AuthA1: string;
  @XSDElement
  AuthA2: string;
  @XSDElement
  AuthA3: string;
  @XSDElement
  AuthQ1: string;
  @XSDElement
  AuthQ2: string;
  @XSDElement
  AuthQ3: string;
  @XSDElement
  BirthDate: string;
  @XSDElement
  Branch: string;
  @XSDElement
  BusinessPhone: string;
  @XSDElement
  Citizenship: string;
  @XSDElement
  City: string;
  @XSDElement
  CompanyName: string;
  @XSDElement
  Country: string;
  @XSDElement
  CountryCode: string;
  @XSDElement
  CreditAllowed: string;
  @XSDElement
  CreditScodeAmount: number;
  @XSDElement
  CustomerCategory: string;
  @XSDElement
  CustomerInfo: string;
  @XSDElement
  CustomerStatus: string;
  @XSDElement
  CustomerType: string;
  @XSDElement
  DigiPassSerialNo: string;
  @XSDElement
  DrvLicNo: string;
  @XSDElement
  EmailHome: string;
  @XSDElement
  EmailWork: string;
  @XSDElement
  EmbossedName: string;
  @XSDElement
  EmbossedNameLong: string;
  @XSDElement
  Felt1: string;
  @XSDElement
  FirstName: string;
  @XSDElement
  GeoCode: string;
  @XSDElement
  IndustryCode: number;
  @XSDElement
  Language: string;
  @XSDElement
  LastName: string;
  @XSDElement
  LegalCustomer: boolean;
  @XSDElement
  MakeCheckSts: number;
  @XSDElement
  Memo: string;
  @XSDElement
  MobilePhone: string;
  @XSDElement
  PassportNo: string;
  @XSDElement
  PostalCode: string;
  @XSDElement
  RelManagerEmail: string;
  @XSDElement
  RelManagerName: string;
  @XSDElement
  RelManagerTlf: string;
  @XSDElement
  ScoreDate: string;
  @XSDElement
  SectorCode: number;
  @XSDElement
  SignatureCardDate: string;
  @XSDElement
  SignaturRef: number;
  @XSDElement
  TDSecure: string;
  @XSDElement
  Title: string;
  @XSDElement
  Tlf: string;
  @XSDElement
  VIPsts: string;
  @XSDElement
  CustomerId: number;
  @XSDElement
  CreditScoreAmount: number;
}
