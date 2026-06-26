import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('send')
  @UseGuards(ThrottlerGuard)
  send(@Body() dto: CreateNotificationDto, @Req() req: any) {
    const user = req['user'];
    return this.notificationsService.send(user.sub, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    const user = req['user'];
    return this.notificationsService.findAll(user.sub);
  }
}