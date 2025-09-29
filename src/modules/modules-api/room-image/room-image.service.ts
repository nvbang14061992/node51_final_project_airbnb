import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import type { Users } from 'generated/prisma';
import { deleteFile, fileExists } from 'src/common/helpers/utils';

@Injectable()
export class RoomImageService {
  constructor(private readonly prisma: PrismaService) {}

  async findRoomImageExisting(id: number) {
    const roomImage = await this.prisma.hinhAnh_Phong.findUnique({
      where: {
        id: id,
      },
    });

    if (!roomImage)
      throw new BadRequestException('Not found this room image!!!');

    return roomImage;
  }

  async create(roomId: number, file: Express.Multer.File, user: Users) {
    const roomExist = await this.prisma.phong.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!roomExist) throw new BadRequestException('Not found this room!!!');

    const newRoom = await this.prisma.hinhAnh_Phong.create({
      data: {
        ma_phong: roomExist.id,
        ma_nguoi_tao: user.id,
        url: file.path,
      },
    });

    return newRoom;
  }

  async findAll() {
    const rooms = await this.prisma.hinhAnh_Phong.findMany();
    return rooms;
  }

  async findOne(id: number) {
    const existingImage = await this.findRoomImageExisting(id);
    return existingImage;
  }

  async remove(id: number, user: Users) {
    const existingImage = await this.findRoomImageExisting(id);

    if (existingImage.ma_nguoi_tao !== user.id)
      throw new BadRequestException('Permission denied!!!');

    const filExist = await fileExists(existingImage.url);
    if (!filExist) {
      throw new NotFoundException('File does not exist');
    }

    // Start a manual pseudo-transaction
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.hinhAnh_Phong.delete({ where: { id } });
      });

      try {
        await deleteFile(existingImage.url);
      } catch (fileErr) {
        // Log and move on — DB is already committed
        console.warn('File deletion failed:', fileErr);
      }

      return true;
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to delete: ' + err.message,
      );
    }
  }

  async findImageWithRoomId(maPhong: number) {
    const roomExist = await this.prisma.phong.findUnique({
      where: {
        id: maPhong,
      },
    });

    if (!roomExist) throw new BadRequestException('Room not found!!!');

    const roomImages = await this.prisma.hinhAnh_Phong.findMany({
      where: {
        ma_phong: +roomExist.id,
      },
    });

    return roomImages;
  }
}
