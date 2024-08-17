import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HelperService } from './helper.service';

dotenv.config();
@Module({
  imports: [],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
