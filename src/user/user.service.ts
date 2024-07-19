import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWaitListDto, CreateWaitListResponseDto } from 'src/dto/userDto';
import { UserWaitList } from 'src/schema/user.schema';
import { EmailService } from 'src/service/mailer.service';

@Injectable()
export class UserWaitListService {
  constructor(
    @InjectModel(UserWaitList.name)
    private readonly userWaitList: Model<UserWaitList>,
    private readonly emailService: EmailService,
  ) {}

  async createWaitlist(
    createWaitListDto: CreateWaitListDto,
  ): Promise<CreateWaitListResponseDto> {
    try {
      const existingUser = await this.userWaitList
        .findOne({ email: createWaitListDto.email })
        .exec();
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
      const user = await this.userWaitList.create(createWaitListDto);

      if (!user) {
        throw new BadRequestException('Error occured while adding user');
      }
      //send user email
      const subject = "You've been added to waitlist successfully.";
      const payload = {
        name: user?.fullName?.split(' ')[0],
      };
      const recipientEmail = user.email;

      await this.emailService.sendUserWaitlist(
        recipientEmail,
        subject,
        'waitlist',
        payload,
      );

      const response: CreateWaitListResponseDto = {
        message: "You've successfully been added to our waitlist. Cheers!",
        data: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        statusCode: 200,
      };
      console.log(response);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}
