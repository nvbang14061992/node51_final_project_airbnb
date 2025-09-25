import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Users } from 'generated/prisma';

@Injectable()
export class RoomImageService {
  constructor(private readonly prisma: PrismaService) {}

  async findRoomImageExisting(id: number) {
    const locationExist = await this.prisma.viTri.findUnique({
      where: {
        id: id,
      },
    });

    if (!locationExist) throw new BadRequestException('Not found room!!!');

    return locationExist;
  }

  async create(createRoomImageDto: CreateRoomImageDto) {
    return 'This action adds a new roomImage';
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

    return true;
  }
}
