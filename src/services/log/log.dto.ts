import { Sorting } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetChangelogQuery {
  @ApiProperty({
    name: 'refBy',
    example: null,
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  refBy: string;

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
    enum: Sorting,
    description: 'This is a optional property',
    required: false,
  })
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
