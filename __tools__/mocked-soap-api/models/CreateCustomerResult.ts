import { XSDComplexType, XSDElement } from "soap-decorators";

@XSDComplexType
export class CreateCustomerResult {
  @XSDElement
  readonly CustomerId: number;
}
