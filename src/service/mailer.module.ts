import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          auth: {
            user: config.get('SENDER_EMAIL'),
            pass: config.get('SENDER_PASSWORD'),
          },
        },
        defaults: {
          from: `"Escrowbyt App" <${config.get('SENDER_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
