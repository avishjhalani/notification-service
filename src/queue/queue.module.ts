import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
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