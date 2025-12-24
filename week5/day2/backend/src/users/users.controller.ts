import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowersService } from '../followers/followers.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LikesService } from '../likes/likes.service';
import { WebSocketGatewayService } from '../websocket/websocket.gateway';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private followersService: FollowersService,
    private notificationsService: NotificationsService,
    private likesService: LikesService,
    private websocketGateway: WebSocketGatewayService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.userId);
  }

  @Get('profile/:username')
  async getProfileByUsername(@Param('username') username: string) {
    return this.usersService.getProfileByUsername(username);
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.userId, updateProfileDto);
  }

  @Post('follow/:targetUserId')
  async followUser(@CurrentUser() user: any, @Param('targetUserId') targetUserId: string) {
    const result = await this.usersService.followUser(user.userId, targetUserId);
    
    // Create and send notification
    const notification = await this.notificationsService.createNotification(
      targetUserId,
      user.userId,
      NotificationType.FOLLOW,
      `${user.username} started following you`,
      user.userId,
      'User',
    );

    if (notification) {
      this.websocketGateway.emitFollowNotification(targetUserId, notification);
    }

    return result;
  }

  @Post('unfollow/:targetUserId')
  async unfollowUser(@CurrentUser() user: any, @Param('targetUserId') targetUserId: string) {
    return this.usersService.unfollowUser(user.userId, targetUserId);
  }

  @Get('followers')
  async getFollowers(@CurrentUser() user: any) {
    return this.followersService.getFollowers(user.userId);
  }

  @Get('following')
  async getFollowing(@CurrentUser() user: any) {
    return this.followersService.getFollowing(user.userId);
  }

  @Get('notifications')
  async getNotifications(@CurrentUser() user: any) {
    return this.notificationsService.getUserNotifications(user.userId);
  }

  @Post('notifications/:id/read')
  async markNotificationAsRead(@CurrentUser() user: any, @Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId, user.userId);
  }

  @Get('liked-comments')
  async getLikedComments(@CurrentUser() user: any) {
    return this.likesService.getUserLikedComments(user.userId);
  }

  @Post('notifications/read-all')
  async markAllNotificationsAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.userId);
  }
}