import { XSDComplexType, XSDElement } from "soap-decorators";
import { GetHistoryResult } from "./GetHistoryResult";

@XSDComplexType
export class GetHistoryPageResult {
  @XSDElement
  currentPage: number;
  @XSDElement
  pageSize: number;
  @XSDElement
  totalCount: number;
  @XSDElement
  data: GetHistoryResult;
}
