import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumberString,
  IsDateString,
  IsEnum,
  IsNumber,
  Matches,
} from 'class-validator';

export class GetBulkDataDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  fields?: string; // Comma-separated string of field names
}

export class CreateCustomerDto {
  @ApiProperty({ default: '' })
  @IsString()
  name: string;

  @ApiProperty({ default: '' })
  @IsString()
  @Matches(/^\d{13}$/, {
    message: 'CNIC must be exactly 13 digits long and contain only numbers.',
  })
  CNIC: string; // Consider adding a regex validation if needed

  @ApiProperty({ default: '' })
  @IsString()
  accountNo: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  installmentAmount: number;

  @ApiProperty({ default: '2025-10-25T01:30:00.000-05:00' })
  @IsDateString()
  fromDate: string; // Expecting ISO date string format

  @ApiProperty({ default: '2026-10-25T01:30:00.000-05:00' })
  @IsDateString()
  toDate: string; // Expecting ISO date string format

  @ApiProperty({ default: 'Monthly' })
  @IsEnum(['Daily', 'Weekly', 'Monthly', 'Yearly'])
  installmentFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsDateString()
  entryDateTime?: string; // Optional, defaults to now
}

export class FilterCustomerDto extends PartialType(CreateCustomerDto) {}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
