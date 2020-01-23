import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class CreateCardResult {
  @XSDElement
  CardId: number;
  @XSDElement
  CardIdVNo: number;
  @XSDElement
  CardNo: string;
  @XSDElement
  TxAccountNo: number;
  @XSDElement
  VersionNo: string;
}
