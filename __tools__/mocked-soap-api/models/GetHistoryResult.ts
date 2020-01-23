import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class GetHistoryResult {
  @XSDElement
  AccountNo: string;
  @XSDElement
  CardNo: string;
  @XSDElement
  VersionNo: string;
  @XSDElement
  EventDate: string;
  @XSDElement
  EventDetails: string;
  @XSDElement
  EventInstId: string;
  @XSDElement
  EventText: string;
  @XSDElement
  EventTime: string;
  @XSDElement
  TCode: string;
  @XSDElement
  UserId: string;
}
