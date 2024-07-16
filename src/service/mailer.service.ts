import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(
    subject: string,
    payload: any,
    recipientEmail: string,
    template: any,
  ) {
    try {
      const result = await this.mailService.sendMail({
        to: recipientEmail,
        subject: subject,
        template: template,
        context: payload,
      });

      console.log(result);

      const verify = await this.mailService.verifyAllTransporters();
      console.log(verify);
    } catch (error) {}
  }
}
