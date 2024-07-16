import { Module } from '@nestjs/common';
import { UserWaitListService } from './user.service';
import { UserWaitListController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserWaitList, UserWaitListSchema } from 'src/schema/user.schema';
import { EmailModule } from 'src/service/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserWaitList.name, schema: UserWaitListSchema },
    ]),
    EmailModule,
  ],
  providers: [UserWaitListService],
  controllers: [UserWaitListController],
  exports: [UserWaitListService],
})
export class UserModule {}
