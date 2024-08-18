import { Module } from '@nestjs/common';
import { UserController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  UserWaitList,
  UserWaitListSchema,
} from 'src/schema/userWaitList.schema';
import { EmailModule } from 'src/service/mailer.module';
import { UserService } from './transaction.service';
import { User, UserSchema } from 'src/schema/user.schema';
import { HelperModule } from 'src/utils/helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserWaitList.name, schema: UserWaitListSchema },
      { name: User.name, schema: UserSchema },
    ]),
    EmailModule,
    HelperModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_USER_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
