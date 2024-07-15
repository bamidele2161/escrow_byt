import { Module } from '@nestjs/common';
import { UserWaitListService } from './user.service';
import { UserWaitListController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserWaitList, UserWaitListSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserWaitList.name, schema: UserWaitListSchema },
    ]),
  ],
  providers: [UserWaitListService],
  controllers: [UserWaitListController],
})
export class UserModule {}
