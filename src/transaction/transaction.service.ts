import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  CreateWaitListDto,
  CreateWaitListResponseDto,
  LoginUserDto,
  ResetPasswordDto,
  VerificationDto,
} from 'src/dto/userDto';
import { User } from 'src/schema/user.schema';
import { UserWaitList } from 'src/schema/userWaitList.schema';
import { EmailService } from 'src/service/mailer.service';
import { HelperService } from 'src/utils/helper.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserWaitList.name)
    private readonly userWaitListModel: Model<UserWaitList>,
    private readonly emailService: EmailService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly helperService: HelperService,
  ) {}

  async createWaitlist(
    createWaitListDto: CreateWaitListDto,
  ): Promise<CreateWaitListResponseDto> {
    try {
      const existingUser = await this.userWaitListModel
        .findOne({ email: createWaitListDto.email })
        .exec();
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
      const user = await this.userWaitListModel.create(createWaitListDto);
      if (!user) {
        throw new BadRequestException('Error occured while adding user');
      }
      //send user email
      const subject = "You've been added to waitlist successfully.";
      const payload = {
        name: user?.fullName?.split(' ')[0],
      };
      const recipientEmail = user.email;

      await this.emailService.sendMail(
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

      return response;
    } catch (error) {
      return error.response;
    }
  }

  //registration
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateWaitListResponseDto> {
    try {
      const existingUser = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const cryptedPassword = await this.helperService.hasher(
        createUserDto?.password,
        12,
      );
      const requireData: CreateUserDto = {
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        password: cryptedPassword,
      };

      const user = await this.userModel.create(requireData);

      if (!user) {
        throw new BadRequestException('Error occured while adding user');
      }

      const jwtPayload = { sub: user._id, email: user.email };

      const emailVerificationToken =
        await this.helperService.generateToken(jwtPayload);

      const url = `${process.env.BASE_URL}/user/activate/${emailVerificationToken}`;

      //send user email
      const subject = 'Your account has been successfully.';
      const payload = {
        name: user?.fullName?.split(' ')[0],
        url,
      };
      const recipientEmail = user.email;

      await this.emailService.sendMail(
        recipientEmail,
        subject,
        'waitlist',
        payload,
      );

      const response: CreateWaitListResponseDto = {
        message: 'Account created successfully',
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
      return error.response;
    }
  }

  //login
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<CreateWaitListResponseDto> {
    try {
      const existingUser = await this.userModel
        .findOne({ email: loginUserDto.email })
        .exec();
      if (!existingUser) {
        throw new NotFoundException('User with this email does not exists');
      }

      let checkPassword = await this.helperService.matchChecker(
        loginUserDto.password,
        existingUser.password,
      );

      if (!checkPassword) {
        throw new BadRequestException('Invalid credentials!');
      }

      const jwtPayload = { sub: existingUser._id, email: existingUser.email };

      const token = await this.helperService.generateToken(jwtPayload);

      const response: CreateWaitListResponseDto = {
        message: 'Login successfully',
        data: {
          id: existingUser._id.toString(),
          fullName: existingUser.fullName,
          email: existingUser.email,
          phone: existingUser.phone,
          token: token,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt,
        },
        statusCode: 200,
      };

      return response;
    } catch (error) {
      return error.response;
    }
  }

  async verifyAccount(verifyDto: string): Promise<VerificationDto> {
    try {
      const userSecret = process.env.TOKEN_USER_SECRET;
      const user = await this.helperService.verifyUserToken(
        verifyDto,
        userSecret as string,
      );

      const checkUser = await this.userModel
        .findOne({ email: user.email })
        .exec();
      if (!checkUser) {
        throw new NotFoundException('User with this email does not exists');
      }

      if (checkUser.isVerified == true) {
        throw new BadRequestException('This account is already verified.');
      }

      const updateUser = await this.userModel.findByIdAndUpdate(
        { id: checkUser.id },
        { isVerified: true },
      );

      if (!updateUser) {
        throw new BadRequestException('Error occured while updating');
      }

      const response = {
        message: 'Your account is now verified.',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async forgotPassword(email: string): Promise<VerificationDto> {
    try {
      const checkUser = await this.userModel.findOne({ email: email }).exec();
      if (!checkUser) {
        throw new NotFoundException('User with this email does not exists');
      }

      const jwtPayload = { sub: checkUser._id, email: checkUser.email };

      const userToken = await this.helperService.generateToken(jwtPayload);

      const updatedUser = await this.userModel.findByIdAndUpdate(
        { id: checkUser._id },
        { resetToken: userToken },
      );

      const url = `${process.env.BASE_URL}/auth/reset-password/${userToken}`;

      //send user email
      const subject = 'Reset Password.';
      const payload = {
        name: checkUser?.fullName?.split(' ')[0],
        url: url,
      };
      const recipientEmail = checkUser.email;

      await this.emailService.sendMail(
        recipientEmail,
        subject,
        'resetLink',
        payload,
      );

      return {
        message: 'Email reset code has been sent to your email',
        statusCode: 200,
      };
    } catch (error) {
      return error.response;
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<VerificationDto> {
    try {
      const checkUser = await this.userModel
        .findOne({ resetToken: resetPasswordDto?.token })
        .exec();
      if (!checkUser) {
        throw new NotFoundException('User with this email does not exists');
      }

      const cryptedPassword = await this.helperService.hasher(
        resetPasswordDto?.password,
        12,
      );

      const updateUser = await this.userModel.findOneAndUpdate(
        { id: checkUser._id },
        { resetToken: null, password: cryptedPassword },
      );

      if (!updateUser) {
        throw new BadRequestException('Error occured while updating');
      }

      return {
        message: 'Password reset successfully',
        statusCode: 200,
      };
    } catch (error) {
      return error.response;
    }
  }
}
