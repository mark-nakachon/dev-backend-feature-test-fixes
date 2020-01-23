import { IsInt, IsDefined, IsPositive } from 'class-validator';

export class PostTransactionReq {
  @IsDefined()
  @IsInt()
  @IsPositive()
  userId;
  @IsInt()
  @IsPositive()
  ruleId;
  @IsDefined()
  @IsInt()
  amount;
}
