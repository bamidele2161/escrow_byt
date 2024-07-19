export class SendMailDto {
  subject: string;
  payload: any;
  senderEmail?: string;
  recipientEmail: string;
  template: any;
}
