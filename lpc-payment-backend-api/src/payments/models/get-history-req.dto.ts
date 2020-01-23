import {
  IsInt,
  IsEmpty,
  ValidateIf,
  IsDefined,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetHistoryReq {
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
  @ValidateIf(o => o.CardNo || o.CustomerId || o.InstId || o.VersionNo)
  @IsEmpty({ message: 'must use one, and only one, of the input key-fields' })
  readonly AccountNo: string;
  @ValidateIf(o => o.AccountNo || o.CustomerId || o.InstId || o.VersionNo)
  @IsEmpty({ message: 'must use one, and only one, of the input key-fields' })
  readonly CardNo: string;
  @ValidateIf(o => o.CardNo || o.AccountNo || o.InstId || o.VersionNo)
  @IsEmpty({ message: 'must use one, and only one, of the input key-fields' })
  readonly CustomerId: string;
  @ValidateIf(o => o.CardNo || o.CustomerId || o.AccountNo || o.VersionNo)
  @IsEmpty({ message: 'must use one, and only one, of the input key-fields' })
  readonly InstId: string;
  @ValidateIf(o => o.CardNo || o.CustomerId || o.InstId || o.AccountNo)
  @IsEmpty({ message: 'must use one, and only one, of the input key-fields' })
  readonly VersionNo: string;
}
