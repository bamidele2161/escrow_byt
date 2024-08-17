import { IsEmail } from 'class-validator';

export class CreateWaitListDto {
  fullName: string;

  @IsEmail()
  email: string;

  phone: string;
}

export class CreateWaitListResponseDto {
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    token?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  statusCode: number;
}

export class CreateUserDto {
  fullName: string;
  @IsEmail()
  email: string;
  phone: string;
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;
  password: string;
}

export class VerificationDto {
  message: string;
  statusCode: number;
}

export class ResetPasswordDto {
  token: string;
  password: string;
}
