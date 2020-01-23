import { XSDComplexType, XSDElement } from "soap-decorators";
import { GetCardsResult } from "./GetCardsResult";

@XSDComplexType
export class GetCardPageResult {
  @XSDElement
  currentPage: number;
  @XSDElement
  pageSize: number;
  @XSDElement
  totalCount: number;
  @XSDElement
  data: GetCardsResult;
}
