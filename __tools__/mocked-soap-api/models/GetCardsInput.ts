import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class GetCardsInput {
  @XSDElement
  page: number;
  @XSDElement
  // tslint:disable-next-line:variable-name
  per_page: number;
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
  ExternalProductId: string;
  @XSDElement
  InstId: string;
  @XSDElement
  Option: number;
}
