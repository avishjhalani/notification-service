import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../prisma.service';

// Parse REDIS_URL into host, port, password
function getRedisConfig() {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: Number(url.port),
      password: url.password || undefined,
    };
  }
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  };
}

@Module({
  imports: [
    BullModule.forRoot({
      redis: getRedisConfig(),
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