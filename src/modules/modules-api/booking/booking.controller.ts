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

@Controller('dat-phong')
@ExcludeFields('deletedBy', 'isDeleted', 'deletedAt')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @MessageResponse('Create one booking successfully!')
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: Users,
  ) {
    return this.bookingService.create(createBookingDto, user);
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
