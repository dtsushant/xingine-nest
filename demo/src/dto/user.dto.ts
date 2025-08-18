import {IsString, IsEmail, IsEnum, IsBoolean, IsOptional, ValidateNested, IsArray, IsNotEmpty} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {FormClass, FormField} from "xingine";

export class PhoneDto {
  @ApiProperty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty({ enum: ['mobile', 'landline'] })
  @IsEnum(['mobile', 'landline'])
  phoneType!: 'mobile' | 'landline';
}

export class CompanyDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  providePhoneNo?: boolean = false;

  @ApiPropertyOptional({ type: [PhoneDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  phones?: PhoneDto[] = [];
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: ['individual', 'business', 'admin'] })
  @IsEnum(['individual', 'business', 'admin'])
  accountType!: 'individual' | 'business' | 'admin';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminCode?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasCompanyInfo?: boolean = false;

  @ApiPropertyOptional({ type: CompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: ['individual', 'business', 'admin'] })
  @IsOptional()
  @IsEnum(['individual', 'business', 'admin'])
  accountType?: 'individual' | 'business' | 'admin';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasCompanyInfo?: boolean;

  @ApiPropertyOptional({ type: CompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;
}

@FormClass({
    title: 'User Login',
    submitLabel: 'Login',
})
export class UserLoginDto {
    @FormField({
        name: 'user.email',
        label: 'Email Address',
        inputType: 'input',
        required: true,
        properties: { placeholder: 'Enter email' },
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email!: string;

    @FormField({
        name: 'user.password',
        label: 'Password',
        inputType: 'password',
        required: true,
        properties: { placeholder: 'Enter password' },
    })
    @ApiProperty()
    @IsNotEmpty()
    readonly password!: string;

    @FormField({
        name: 'rememberMe',
        label: 'Remember Me',
        inputType: 'checkbox',
        properties: { label: 'Remember Me' },
    })
    @ApiProperty()
    readonly rememberMe?: boolean = false;
}

