import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.forRoot({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
    EmailModule,
  ],
  providers: [NotificationProcessor, PrismaService],
  exports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
})
export class QueueModule {}