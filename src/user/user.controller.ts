import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserWaitListService } from './user.service';
import {
  CreateUserDto,
  CreateWaitListDto,
  CreateWaitListResponseDto,
  LoginUserDto,
  ResetPasswordDto,
  VerificationDto,
} from 'src/dto/userDto';
import { HelperService } from 'src/utils/helper.service';

@Controller('user')
export class UserWaitListController {
  constructor(private readonly userwaitlistservice: UserWaitListService) {}

  @Post('waitlist')
  async createUserWaitList(
    @Body() createWaitListDto: CreateWaitListDto,
  ): Promise<CreateWaitListResponseDto> {
    return await this.userwaitlistservice.createWaitlist(createWaitListDto);
  }

  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateWaitListResponseDto> {
    return await this.userwaitlistservice.createUser(createUserDto);
  }

  @Post('login')
  async loginUser(
    @Body() loginDto: LoginUserDto,
  ): Promise<CreateWaitListResponseDto> {
    return await this.userwaitlistservice.loginUser(loginDto);
  }

  @Post('verify')
  async verifyAccount(@Body() verifyDto: string): Promise<VerificationDto> {
    return await this.userwaitlistservice.verifyAccount(verifyDto);
  }
  @Post('forgot-pasword')
  async forgotPassword(@Body() email: string): Promise<VerificationDto> {
    return await this.userwaitlistservice.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<VerificationDto> {
    return await this.userwaitlistservice.resetPassword(resetPasswordDto);
  }
}
