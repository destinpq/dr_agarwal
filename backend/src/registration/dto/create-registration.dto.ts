import { IsString, IsEmail, IsInt, Min, Max, IsArray, IsOptional, IsEnum, ArrayMinSize, ArrayMaxSize, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export class CreateRegistrationDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(7, 20)
  phone: string;

  @IsInt()
  @Min(18)
  @Max(100)
  @Type(() => Number)
  age: number;

  @IsString()
  interestArea: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => String)
  preferredDates: string[];

  @IsString()
  preferredTiming: string;

  @IsString()
  @IsOptional()
  expectations?: string;

  @IsString()
  referralSource: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}

export class UpdateRegistrationDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
} 