import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(to: string, subject: string, body: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      text: body,
    });
  }
}