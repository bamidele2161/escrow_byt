import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserWaitListService } from './user.service';
import { CreateWaitListDto, CreateWaitListResponseDto } from 'src/dto/userDto';

@Controller('user')
export class UserWaitListController {
  constructor(private readonly userwaitlistservice: UserWaitListService) {}

  @Post('waitlist')
  async createUserWaitList(
    @Body() createWaitListDto: CreateWaitListDto,
  ): Promise<CreateWaitListResponseDto> {
    return await this.userwaitlistservice.createWaitlist(createWaitListDto);
  }
}
