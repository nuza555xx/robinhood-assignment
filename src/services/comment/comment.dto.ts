import { CommentStatus, Sorting } from '@enums';
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

export class CreateCommentDto {
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
    name: 'content',
    example: 'The standard Lorem Ipsum passage, used since the 1500s',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  content: string;

  @ApiProperty({
    name: 'status',
    description: 'This is a optional property',
    required: false,
    enum: CommentStatus,
  })
  @IsOptional()
  @IsEnum(CommentStatus)
  @Type(() => String)
  status?: CommentStatus;
}

export class UpdateCommentDto {
  @ApiProperty({
    name: 'content',
    example: 'The standard Lorem Ipsum passage, used since the 1500s',
    description: 'This is a optional property',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  content?: string;

  @ApiProperty({
    name: 'status',
    description: 'This is a optional property',
    required: false,
    enum: CommentStatus,
  })
  @IsOptional()
  @IsEnum(CommentStatus)
  @Type(() => String)
  status?: CommentStatus;
}

export class GetCommentQuery {
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
