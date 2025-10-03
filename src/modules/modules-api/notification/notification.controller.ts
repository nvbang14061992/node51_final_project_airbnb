import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SkipPermission } from 'src/common/decorators/skip-permission.decorator';

@Controller('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('mark-read')
  @SkipPermission()
  @MessageResponse('Mark notification as read successfully!!!')
  markRead(@CurrentUser() user: Users, @Body() markReadDto: MarkReadDto) {
    return this.notificationService.markRead(user, markReadDto.ids);
  }

  @Get()
  @SkipPermission()
  @MessageResponse('Get notifications successfully!!!')
  findAll(@CurrentUser() user: Users, @Query() query: QueryPaginationDto) {
    return this.notificationService.findAll(user, query);
  }

  @Get('count/')
  @SkipPermission()
  @MessageResponse('Count number of unread notifications successfully!!!')
  countNotifications(@CurrentUser() user: Users) {
    return this.notificationService.countNotifications(user);
  }

  @Delete(':id')
  @MessageResponse('Delete notification successfully!!!')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
