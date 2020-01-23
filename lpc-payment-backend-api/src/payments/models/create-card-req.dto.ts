import {
  Length,
  MaxLength,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsDefined,
} from 'class-validator';

export class CreateCardReq {
  @IsDefined()
  @MaxLength(30)
  readonly CardCity: string;

  @IsDefined()
  @MaxLength(9)
  readonly CardPostalCode: string;

  @IsDefined()
  @IsInt()
  @Min(1)
  @Max(100000000000000000)
  readonly CustomerId: number;

  @IsDefined()
  @Length(1, 35)
  readonly CustomerNo: string;

  @IsDefined()
  @MaxLength(26)
  readonly EmbossedName: string;

  @IsDefined()
  @MaxLength(40)
  readonly FirstName: string;

  @IsDefined()
  @Length(4, 9)
  readonly InstId: string;

  @IsDefined()
  @MaxLength(40)
  readonly LastName: string;

  @IsDefined()
  @MaxLength(30)
  readonly PinCity: string;

  @IsDefined()
  @MaxLength(9)
  readonly PinPostalCode: string;

  @IsInt()
  @Min(1)
  @Max(99999)
  readonly ProductId: number;

  @IsDefined()
  @IsIn(['K', 'C', 'D', 'R', 'P', 'B'])
  readonly ShipmentMethodCard: string;

  @IsDefined()
  @IsIn(['K', 'C', 'D', 'R', 'P', 'B', 'N'])
  readonly ShipmentMethodPin: string;

  @Length(1, 35)
  readonly AccountNo: string;

  @Length(1, 35)
  readonly AccountNo2: string;

  @Length(1, 35)
  readonly AccountOwner: string;

  @IsInt()
  @IsIn([0, 8, 9])
  readonly ActivateFlag: number;

  @IsIn(['S', 'A'])
  readonly AddrTypeCard: string;

  @IsIn(['S', 'A'])
  readonly AddrTypePin: string;

  @MaxLength(35)
  readonly AnnualFeeAccountNo: number;

  @IsInt()
  @Min(1)
  @Max(99999999)
  readonly BulkId: number;

  @MaxLength(40)
  readonly CardAddress1: string;

  @MaxLength(40)
  readonly CardAddress2: string;

  @MaxLength(40)
  readonly CardAddress3: string;

  @MaxLength(40)
  readonly CardAddress4: string;

  @MaxLength(40)
  readonly CardAddress5: string;

  @MaxLength(40)
  readonly CardAddress6: string;

  @MaxLength(30)
  readonly CardCountry: string;

  @Length(4, 9)
  readonly CardDeliveryBank: string;

  @IsInt()
  @Min(0)
  @Max(999999)
  readonly CardDesignNo: number;

  @IsIn(['if'])
  readonly CardFlag: string;

  @MaxLength(50)
  readonly CardInfo: string;

  @Length(1, 35)
  readonly ChargeAccountNo: string;

  @IsInt()
  @Min(0)
  @Max(999999999999)
  readonly CredLimit: number;

  @MaxLength(26)
  readonly EmbossedName2: string;

  @Length(4, 4)
  readonly Expire: string;

  @Length(1, 30)
  readonly ExtPictureId: string;

  @IsInt()
  @Min(1)
  @Max(12)
  readonly FeeMonth: number;

  @Length(1, 1)
  readonly GKIndikator: string;

  @IsInt()
  @Min(1)
  @Max(99)
  readonly MakeCheckSts: number;

  @MaxLength(256)
  readonly Note: string;

  @IsIn(['P'])
  readonly OrderPurpose: string;

  @IsIn(['K', 'P', 'A', ' '])
  readonly OrderType: string;

  @IsInt()
  @Min(0)
  @Max(99)
  readonly PAmounthLengthSp3: number;

  @IsInt()
  @Min(0)
  @Max(99)
  readonly PAmounthSp3: number;

  @MaxLength(40)
  readonly PinAddress1: string;

  @MaxLength(40)
  readonly PinAddress2: string;

  @MaxLength(40)
  readonly PinAddress3: string;

  @MaxLength(40)
  readonly PinAddress4: string;

  @MaxLength(40)
  readonly PinAddress5: string;

  @MaxLength(40)
  readonly PinAddress6: string;

  @MaxLength(30)
  readonly PinCountry: string;

  @IsIn(['S', 'T'])
  readonly PinMethod: string;

  @MaxLength(40)
  readonly PinName: string;

  @IsDateString()
  readonly ShipmentDate: string;

  @Length(16, 21)
  readonly SIR: string;

  @IsDateString()
  readonly ValidFromDate: string;
}
