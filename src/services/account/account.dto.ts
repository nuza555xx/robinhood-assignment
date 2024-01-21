import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

class AvatarDto {
  @ApiProperty({
    name: 'thumbnail',
    example: 'http://via.placeholder.com/256x256',
    description: 'This is a optional property',
    required: false,
  })
  @IsObject()
  thumbnail?: string;

  @ApiProperty({
    name: 'original',
    example: 'http://via.placeholder.com/1024x1024',
    description: 'This is a optional property',
    required: false,
  })
  @IsObject()
  original?: string;
}

export class CreateAccountsDto {
  @ApiProperty({
    name: 'username',
    example: 'example',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  username: string;

  @ApiProperty({
    name: 'password',
    example: '$12345678Ab',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    name: 'displayName',
    example: 'example',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  displayName: string;

  @ApiProperty({
    name: 'avatar',
    examples: AvatarDto,
    description: 'This is a optional property',
    required: false,
  })
  @IsOptional()
  @IsObject()
  avatar?: AvatarDto;
}

export class LoginDto {
  @ApiProperty({
    name: 'username',
    example: 'admin',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  username: string;

  @ApiProperty({
    name: 'password',
    example: '$12345678Ab',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
