import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
