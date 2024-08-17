import { Module } from '@nestjs/common';
import { UserWaitListService } from './user.service';
import { UserWaitListController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  UserWaitList,
  UserWaitListSchema,
} from 'src/schema/userWaitList.schema';
import { EmailModule } from 'src/service/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserWaitList.name, schema: UserWaitListSchema },
    ]),
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_USER_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [UserWaitListService],
  controllers: [UserWaitListController],
  exports: [UserWaitListService],
})
export class UserModule {}
