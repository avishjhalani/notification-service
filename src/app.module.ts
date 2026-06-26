// This is the registry. Every controller and service you create must be registered here — otherwise NestJS doesn't know it exists.


import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';
import { Throttle, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers:[
        {
          name :'notifications',
          ttl :60000,
          limit :5,
        },
      ],
      storage :new ThrottlerStorageRedisService({
        host :process.env.REDIS_HOST,
        port : Number(process.env.REDIS_PORT),
      }),
    }),
    AuthModule, NotificationsModule , QueueModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
