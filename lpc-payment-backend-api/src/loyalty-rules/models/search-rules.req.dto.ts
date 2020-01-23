import { IsInt, IsDefined, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRulesReq {
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @IsPositive()
  page = 1;
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @IsPositive()
  // tslint:disable-next-line:variable-name
  per_page = 20;
}
