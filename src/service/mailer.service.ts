import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(
    recipientEmail: string,
    subject: string,
    template: string,
    payload: any,
  ): void {
    this.mailerService.sendMail({
      to: recipientEmail,
      from: process.env.MAIL_SENDER,
      subject: subject,
      template: template,
      context: payload,
    });
  }
}
