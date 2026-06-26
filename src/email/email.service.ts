import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor() {
    const port = Number(process.env.MAIL_PORT);

    // Port 465 uses implicit SSL (secure: true).
    // Ports 587 and 2525 use STARTTLS — the connection starts plain and upgrades,
    // so secure must be false. Nodemailer's tls.rejectUnauthorized: false below
    // allows the STARTTLS handshake to complete against self-signed/sandbox certs.
    const secure = port === 465;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailerVersion = require('nodemailer/package.json').version as string;
    this.logger.log(`Nodemailer version: ${nodemailerVersion}`);
    this.logger.log(`Creating SMTP transporter — host: ${process.env.MAIL_HOST}, port: ${port}, secure: ${secure}`);

    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      secure,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      // Fail fast if the SMTP server is unreachable rather than hanging indefinitely.
      connectionTimeout: 10000,
    });

    this.logger.log('SMTP transporter created successfully');
  }

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`Attempting to send email to: ${to}, subject: "${subject}"`);
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text: body,
      });
      this.logger.log(`Email sent successfully to: ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to} — ${error.code ?? 'UNKNOWN_CODE'}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}