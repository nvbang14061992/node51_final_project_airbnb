import { PartialType, PickType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PickType(CreateBookingDto, [
  'ma_phong',
  'ngay_den',
  'ngay_di',
  'so_luong_khach',
]) {}
