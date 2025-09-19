import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { QueryRoomDto } from './dto/query-room.dto';
import { QueryRoomLocationDto } from './dto/query-location.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findRoomExisting(id: number) {
    const roomExist = await this.prisma.phong.findUnique({
      where: {
        id: id,
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
    const rooms = await this.prisma.phong.findMany();
    return rooms;
  }

  async findAllPagination(query: QueryRoomDto) {
    let { page, pageSize, filtersStringJson } = query;
    page = +page > 0 ? +page : 1; // avoid return error, for user experience
    pageSize = +pageSize > 0 ? +pageSize : 10;
    const filters = JSON.parse(filtersStringJson || '{}') || {};

    const index = (page - 1) * +pageSize; // default pageSize is 3

    // process filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        delete filters[key];
        return;
      }

      if (typeof value === 'string') {
        filters[key] = {
          contains: value,
        };
      }
    });

    const phongThuePromise = this.prisma.phong.findMany({
      skip: index,
      take: +pageSize,

      where: {
        ...filters,
      },
    });

    // counts total rows in table
    const totalItemsPromise = this.prisma.phong.count();

    const [rooms, totalItems] = await Promise.all([
      phongThuePromise,
      totalItemsPromise,
    ]);

    // calculate total pages
    const totalPages = Math.ceil(totalItems / +pageSize);
    return {
      page,
      pageSize,
      totalItem: totalItems,
      totalPage: totalPages,
      items: rooms || [],
    };
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

    await this.prisma.phong.delete({
      where: {
        id: roomExist.id,
      },
    });

    return true;
  }

  async findAllLocation(query: QueryRoomLocationDto) {
    let { locationId } = query;

    const location = await this.prisma.viTri.findUnique({
      where: {
        id: locationId,
      },
    });

    if (!location) throw new BadRequestException('Not found location!!!');

    const roomWithgivenLocationId = await this.prisma.phong.findMany({
      where: {
        ma_vi_tri: locationId,
      },
    });

    if (!roomWithgivenLocationId)
      throw new BadRequestException('Not exist room for this location');

    return roomWithgivenLocationId;
  }
}
