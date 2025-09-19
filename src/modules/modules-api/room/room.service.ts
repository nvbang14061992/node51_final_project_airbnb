import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { QueryRoomDto } from './dto/query-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
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

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
