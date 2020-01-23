import { IsIn, IsInt, IsString, IsDefined, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCardsReq {
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @IsPositive()
  page = 1;

  @Type(() => Number)
  @IsInt()
  @IsDefined()
  @IsPositive()
  // tslint:disable-next-line:variable-name
  per_page = 20;

  @IsString()
  readonly AccountNo: string;

  @IsString()
  readonly AccountOwner: string;

  @IsString()
  readonly Branch: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly CardId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly CardIdVNo: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly CustomerId: number;

  @IsString()
  readonly CustomerNo: string;

  @IsString()
  readonly ExtAgreementId: string;

  @IsString()
  readonly ExternalProductId: string;

  @IsString()
  readonly InstId: string;

  @Type(() => Number)
  @IsIn([0, 1, 2, 3, 9])
  readonly Option: number;
}
