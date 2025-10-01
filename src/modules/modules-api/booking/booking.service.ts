import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Users } from 'generated/prisma';
import { use } from 'passport';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}
  async findBookingExisting(id: number) {
    const bookingExist = await this.prisma.datPhong.findUnique({
      where: {
        id: id,
      },
    });

    if (!bookingExist)
      throw new BadRequestException('Not found this booking!!!');

    return bookingExist;
  }

  async checkBookingExist(
    ma_phong: number,
    ngay_den: Date,
    ngay_di: Date,
    userId: null | number = null,
  ) {
    const bookingExist = await this.prisma.datPhong.findFirst({
      where: {
        ma_phong: ma_phong,
        ngay_den: ngay_den,
        ngay_di: ngay_di,
      },
    });

    const message = 'Room not available this date!!!';

    if (bookingExist) throw new BadRequestException(message);
  }

  async checkRoomExist(ma_phong: number) {
    const roomExist = await this.prisma.phong.findUnique({
      where: {
        id: ma_phong,
      },
    });

    if (!roomExist) throw new BadRequestException('Not found room!!!');
  }
  async create(createBookingDto: CreateBookingDto, user: Users) {
    const { ma_phong, ngay_den, ngay_di, so_luong_khach } = createBookingDto;
    await this.checkRoomExist(ma_phong);

    await this.checkBookingExist(ma_phong, ngay_den, ngay_di);

    const newBooking = await this.prisma.datPhong.create({
      data: {
        ma_phong: ma_phong,
        ngay_den: ngay_den,
        ngay_di: ngay_di,
        so_luong_khach: so_luong_khach,
        ma_nguoi_dat: user.id,
      },
    });

    return newBooking;
  }

  async findAll() {
    const allBookings = await this.prisma.datPhong.findMany();
    return allBookings;
  }

  async findBookingWithUserId(MaNguoiDung: number) {
    const userExist = await this.prisma.users.findUnique({
      where: {
        id: MaNguoiDung,
      },
    });

    if (!userExist) throw new BadRequestException('Not found user!!!');

    const allBookings = await this.prisma.datPhong.findMany({
      where: {
        ma_nguoi_dat: userExist.id,
      },
    });
    return allBookings;
  }

  async findOne(id: number) {
    const bookingExist = await this.findBookingExisting(id);
    return bookingExist;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto, user: Users) {
    const bookingExist = await this.findBookingExisting(id);
    const { ma_phong, ngay_den, ngay_di, so_luong_khach } = updateBookingDto;

    await this.checkRoomExist(ma_phong);

    console.log(bookingExist);
    // Prevent updating other user booking
    if (bookingExist.ma_nguoi_dat !== user.id)
      throw new BadRequestException('Permission denied!!!');

    // Check if the room was booked by other user
    const conflictingBooking = await this.prisma.datPhong.findFirst({
      where: {
        ma_phong,
        id: { not: id }, // Exclude the current booking
        OR: [
          {
            ngay_den: { lte: ngay_di },
            ngay_di: { gte: ngay_di },
          },
          {
            ngay_den: { lte: ngay_den },
            ngay_di: { gte: ngay_den },
          },
          {
            ngay_den: { gte: ngay_den },
            ngay_di: { lte: ngay_di },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException('Room was already booked by another user');
    }

    const newBookingInfo = this.prisma.datPhong.update({
      data: {
        ma_phong: ma_phong,
        ngay_den: ngay_den,
        ngay_di: ngay_di,
        so_luong_khach: so_luong_khach,
      },
      where: {
        id: bookingExist.id,
      },
    });

    return newBookingInfo;
  }

  async remove(id: number, user: Users) {
    const bookingExist = await this.findBookingExisting(id);
    if (bookingExist.ma_nguoi_dat !== user.id)
      throw new BadRequestException('Permission denied!!!');

    await this.prisma.datPhong.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}
