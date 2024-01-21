import { InterviewStatus, Sorting } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty({
    name: 'title',
    example: 'The standard Lorem Ipsum passage, used since the 1500s',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    name: 'description',
    example: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia`,
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    name: 'status',
    description: 'This is a optional property',
    required: false,
    enum: InterviewStatus,
  })
  @IsOptional()
  @IsEnum(InterviewStatus)
  @Type(() => String)
  status?: InterviewStatus;
}

export class UpdateInterviewDto {
  @ApiProperty({
    name: 'title',
    description: 'This is a optional property',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    name: 'description',
    description: 'This is a optional property',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    name: 'status',
    description: 'This is a optional property',
    required: false,
    enum: InterviewStatus,
  })
  @IsOptional()
  @IsEnum(InterviewStatus)
  @Type(() => String)
  status?: InterviewStatus;
}

export class GetInterviewQuery {
  @ApiProperty({
    name: 'search',
    example: null,
    description: 'This is a optional property',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiProperty({
    name: 'status',
    example: null,
    description: 'This is a optional property',
    required: false,
    enum: InterviewStatus,
  })
  @IsOptional()
  @IsEnum(InterviewStatus)
  @Type(() => String)
  status?: InterviewStatus;

  @ApiProperty({
    name: 'sortBy',
    example: null,
    description: 'This is a optional property',
    required: false,
  })
  @IsOptional()
  @IsEnum(Sorting)
  sortBy?: string;

  @ApiProperty({
    name: 'sort',
    example: null,
    description: 'This is a optional property',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    name: 'next',
    example: null,
    description: 'This is a optional property',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  next?: number;

  @ApiProperty({
    name: 'size',
    example: 5,
    description: 'This is a optional property',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  size?: number;
}

export class GetIdParam {
  @ApiProperty({
    name: 'id',
    example: null,
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
