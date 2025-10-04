import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { NotificationService } from '../notification/notification.service';
import { RealtimeNotificationService } from 'src/modules/modules-system/realtime-notification/realtime-notification.service';

@Controller('dat-phong')
@ExcludeFields('deletedBy', 'isDeleted', 'deletedAt')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly realtimenotificationService: RealtimeNotificationService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  @MessageResponse('Create one booking successfully!')
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: Users,
  ) {
    const data = await this.bookingService.create(createBookingDto, user);

    // send notification
    const hostId = Number(data.hostId);
    const message = `New booking confirmed for room ${data.newBooking.ma_phong}, hostId: ${hostId}`;
    const newNotification =
      await this.realtimenotificationService.notifyBookingSuccess(
        `${hostId}`,
        message,
      );

    // store notification statically
    if (newNotification) {
      await this.notificationService.create({
        bookingId: data.newBooking.id,
        receiverId: hostId,
        title: message,
        type: 'booking',
      });
    }

    return data.newBooking;
  }

  @Get()
  @MessageResponse('Get all bookings successfully!')
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @MessageResponse('Get one booking successfully!')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  @MessageResponse('Update one booking successfully!')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: Users,
  ) {
    return this.bookingService.update(+id, updateBookingDto, user);
  }

  @Delete(':id')
  @MessageResponse('Delete one booking successfully!')
  remove(@Param('id') id: string, @CurrentUser() user: Users) {
    return this.bookingService.remove(+id, user);
  }

  @Get('/lay-theo-nguoi-dung/:MaNguoiDung')
  @MessageResponse('Get all bookings from a user successfully!')
  findBookingWithUserId(@Param('MaNguoiDung') MaNguoiDung: string) {
    return this.bookingService.findBookingWithUserId(+MaNguoiDung);
  }
}
