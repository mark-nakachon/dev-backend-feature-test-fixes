import {
  IsDefined,
  MaxLength,
  Length,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsISO8601,
  IsEmail,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateCustomerReq {
  @IsDefined()
  @MaxLength(35)
  readonly CustomerNo: string;

  @IsDefined()
  @Length(4, 9)
  readonly InstId: string;

  @MaxLength(3600)
  readonly AccountList: string;

  @MaxLength(40)
  readonly Address1: string;

  @MaxLength(40)
  readonly Address2: string;

  @MaxLength(40)
  readonly Address3: string;

  @MaxLength(40)
  readonly Address4: string;

  @MaxLength(40)
  readonly Address5: string;

  @MaxLength(40)
  readonly Address6: string;

  @MaxLength(40)
  readonly AltAddress1: string;

  @MaxLength(40)
  readonly AltAddress2: string;

  @MaxLength(40)
  readonly AltAddress3: string;

  @MaxLength(40)
  readonly AltAddress4: string;

  @MaxLength(40)
  readonly AltAddress5: string;

  @MaxLength(40)
  readonly AltAddress6: string;

  @MaxLength(40)
  readonly AltCity: string;

  @MaxLength(40)
  readonly AltCountry: string;

  @MaxLength(9)
  readonly AltPostalCode: string;

  @MaxLength(64)
  readonly AuthA1: string;

  @MaxLength(64)
  readonly AuthA2: string;

  @MaxLength(64)
  readonly AuthA3: string;

  @MaxLength(124)
  readonly AuthQ1: string;

  @MaxLength(124)
  readonly AuthQ2: string;

  @MaxLength(124)
  readonly AuthQ3: string;

  @IsISO8601()
  readonly BirthDate: string;

  @Length(2, 9)
  readonly Branch: string;

  @MaxLength(16)
  readonly BusinessPhone: string;

  @MaxLength(25)
  readonly Citizenship: string;

  @MaxLength(30)
  readonly City: string;

  @MaxLength(30)
  readonly CompanyName: string;

  @MaxLength(30)
  readonly Country: string;

  @MaxLength(3)
  readonly CountryCode: string;

  @IsIn(['Y', 'N'])
  readonly CreditAllowed: string;

  @IsNumber()
  readonly CreditScodeAmount: number;

  @MaxLength(20)
  readonly CustomerCategory: string;

  @MaxLength(50)
  readonly CustomerInfo: string;

  @IsIn(['0', '1', '2', '3'])
  readonly CustomerStatus: string;

  @IsIn(['1', '2', '3', '5', '6'])
  readonly CustomerType: string;

  @MaxLength(12)
  readonly DigiPassSerialNo: string;

  @MaxLength(24)
  readonly DrvLicNo: string;

  @IsEmail()
  @MaxLength(75)
  readonly EmailHome: string;

  @IsEmail()
  @MaxLength(75)
  readonly EmailWork: string;

  @MaxLength(26)
  readonly EmbossedName: string;

  @MaxLength(30)
  readonly EmbossedNameLong: string;

  @MaxLength(20)
  readonly Felt1: string;

  @MaxLength(40)
  readonly FirstName: string;

  @MaxLength(4)
  readonly GeoCode: string;

  @IsInt()
  @Min(0)
  @Max(99999)
  readonly IndustryCode: number;

  @Length(2, 2)
  readonly Language: string;

  @MaxLength(40)
  readonly LastName: string;

  @IsBoolean()
  readonly LegalCustomer: boolean;

  @IsInt()
  @Min(1)
  @Max(99)
  readonly MakeCheckSts: number;

  @MaxLength(2000)
  readonly Memo: string;

  @MaxLength(20)
  readonly MobilePhone: string;

  @MaxLength(24)
  readonly PassportNo: string;

  @MaxLength(9)
  readonly PostalCode: string;

  @IsEmail()
  @MaxLength(75)
  readonly RelManagerEmail: string;

  @MaxLength(60)
  readonly RelManagerName: string;

  @MaxLength(20)
  readonly RelManagerTlf: string;

  @IsISO8601()
  readonly ScoreDate: string;

  @IsInt()
  @Min(1)
  @Max(99999)
  readonly SectorCode: number;

  @IsISO8601()
  readonly SignatureCardDate: string;

  @IsInt()
  @Min(1)
  @Max(99999999)
  readonly SignaturRef: number;

  @MaxLength(20)
  readonly TDSecure: string;

  @MaxLength(8)
  readonly Title: string;

  @MaxLength(16)
  readonly Tlf: string;

  @MaxLength(8)
  readonly VIPsts: string;

  @IsInt()
  readonly CustomerId: string;

  @IsNumber()
  readonly CreditScoreAmount: number;
}
