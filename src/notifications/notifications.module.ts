import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports:[
    JwtModule.register({
      secret:process.env.JWT_SECRET,
    }),
    QueueModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService,PrismaService]
})
export class NotificationsModule {}
