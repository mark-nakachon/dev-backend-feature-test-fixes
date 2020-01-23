import { IsInt, IsDefined, IsPositive } from 'class-validator';

export class ModifyPointsReq {
  @IsDefined()
  @IsInt()
  @IsPositive()
  points;
}
