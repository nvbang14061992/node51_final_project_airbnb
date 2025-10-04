import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { QueryRoomDto } from './dto/query-room.dto';
import { QueryRoomLocationDto } from './dto/query-location.dto';
import { Phong } from 'generated/prisma';
import { getItemsPagination, PaginationResult } from 'src/common/helpers/utils';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findRoomExisting(id: number) {
    const roomExist = await this.prisma.phong.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!roomExist) throw new BadRequestException('Not found room!!!');

    return roomExist;
  }

  async create(createRoomDto: CreateRoomDto) {
    const newRoom = await this.prisma.phong.create({
      data: {
        ...createRoomDto,
      },
    });
    return newRoom;
  }

  async findAll() {
    const rooms = await this.prisma.phong.findMany({
      where: {
        isDeleted: false,
      },
    });
    return rooms;
  }

  async findAllPagination(
    query: QueryRoomDto,
  ): Promise<PaginationResult<Phong>> {
    const softDeleteFilter = { isDeleted: false };

    const data = await getItemsPagination<Phong>(
      query,
      this.prisma.phong,
      softDeleteFilter,
    );

    return data;
  }

  async findOne(id: number) {
    const roomExist = await this.findRoomExisting(id);
    return roomExist;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const roomExist = await this.findRoomExisting(id);

    const newRoomUpdated = await this.prisma.phong.update({
      where: {
        id: roomExist.id,
      },
      data: {
        ...updateRoomDto,
      },
    });

    return newRoomUpdated;
  }

  async remove(id: number) {
    const roomExist = await this.findRoomExisting(id);

    await this.prisma.phong.update({
      data: {
        isDeleted: true,
      },
      where: {
        id: roomExist.id,
      },
    });

    return true;
  }

  async findAllRoomWithLocationId(query: QueryRoomLocationDto) {
    let { ma_vi_tri } = query;

    const location = await this.prisma.viTri.findUnique({
      where: {
        id: ma_vi_tri,
        isDeleted: false,
      },
    });

    if (!location) throw new BadRequestException('Not found location!!!');

    const roomWithgivenLocationId = await this.prisma.phong.findMany({
      where: {
        ma_vi_tri: ma_vi_tri,
        isDeleted: false,
      },
    });

    if (!roomWithgivenLocationId)
      throw new BadRequestException('Not exist room for this location');

    return roomWithgivenLocationId;
  }
}
