import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectQueue } from '@nestjs/bull';
import type{ Queue } from 'bull';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationQueue :Queue,
  ) {}

  async send(userId: number, dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        to: dto.to,
        subject: dto.subject,
        body: dto.body,
        status: 'pending',
      }
    });
   await this.notificationQueue.add(
    'send-email',
    {
      notificationId : notification.id,
      to :dto.to,
      subject : dto.subject,
      body : dto.body,
    },{
      attempts :3,
      backoff:{
        type :'exponential',
        delay :5000,
      },
    }
   );
    return {
      id: notification.id,
      status: notification.status,
      message: 'Notification queued successfully',
    };
  }

  async findAll(userId: number) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  }
}