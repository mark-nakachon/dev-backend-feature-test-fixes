import {
  IsInt,
  Min,
  Max,
  MaxLength,
  IsDefined,
  IsObject,
} from 'class-validator';

export class PostOrPutRuleReq {
  @IsDefined()
  @MaxLength(255)
  readonly operation: string;

  @IsDefined()
  @IsObject()
  readonly rule: any;

  @IsDefined()
  @IsInt()
  @Min(-2147483648)
  @Max(2147483647)
  readonly reward: number;
}
