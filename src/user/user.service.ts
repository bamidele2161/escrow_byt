import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';
import { Model } from 'mongoose';
import { CreateWaitListDto, CreateWaitListResponseDto } from 'src/dto/userDto';
import { UserWaitList } from 'src/schema/user.schema';

@Injectable()
export class UserWaitListService {
  constructor(
    @InjectModel(UserWaitList.name)
    private readonly userWaitList: Model<UserWaitList>,
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

      return response;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
