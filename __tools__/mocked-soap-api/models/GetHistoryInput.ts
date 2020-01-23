import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class GetHistoryInput {
  @XSDElement
  page: number;
  @XSDElement
  // tslint:disable-next-line:variable-name
  per_page: number;
  @XSDElement
  AccountNo: string;
  @XSDElement
  CardNo: string;
  @XSDElement
  CustomerId: string;
  @XSDElement
  InstId: string;
  @XSDElement
  VersionNo: string;
}
