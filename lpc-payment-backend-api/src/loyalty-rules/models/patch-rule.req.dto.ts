import { IsInt, Min, Max, MaxLength, IsObject } from 'class-validator';

export class PatchRuleReq {
  @MaxLength(255)
  readonly operation: string;

  @IsObject()
  readonly rule: any;

  @IsInt()
  @Min(-2147483648)
  @Max(2147483647)
  readonly reward: number;
}
