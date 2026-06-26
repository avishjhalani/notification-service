import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma.service';

@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(`Completed job ${job.id}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(`Failed job ${job.id}: ${err.message}`);
  }

  @Process('send-email')
  async handelSendEmail(job: Job) {
    console.log(`Worker picked up job ${job.id}`);
    const { notificationId, to, subject, body } = job.data;

    try {
      await this.emailService.sendEmail(to, subject, body);
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'sent',
          attempts: job.attemptsMade + 1,
        },
      });
      console.log(`✅ Email sent to ${to}`);
    } catch (error) {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'failed',
          attempts: job.attemptsMade + 1,
        },
      });
      console.log(`❌ Email failed ${to}: ${error.message}`);
      throw error;
    }
  }
}