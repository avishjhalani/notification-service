import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis.railway.internal',
        port: 6379,
        username: 'default',
        password: 'gLOulkKDzzwtHBIOjQvoOrNPCCLJvUQZ',
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