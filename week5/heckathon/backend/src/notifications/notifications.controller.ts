import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.notificationsService.findByUser(userId, limitNum);
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('user/:userId/mark-all-read')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  deleteNotification(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.notificationsService.deleteNotification(id, userId);
  }

  @Post('cleanup')
  cleanupOldNotifications() {
    return this.notificationsService.cleanupOldNotifications();
  }
}
