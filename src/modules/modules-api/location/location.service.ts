import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { QueryLocationDto } from './dto/query-location.dto';
import { QueryIdDto } from 'src/common/dtos/query-id.dto';
import {
  deleteFile,
  fileExists,
  getItemsPagination,
  PaginationResult,
} from 'src/common/helpers/utils';
import { ViTri } from 'generated/prisma';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async findLocationExisting(id: number) {
    const locationExist = await this.prisma.viTri.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!locationExist) throw new BadRequestException('Not found location!!!');

    return locationExist;
  }

  async create(createLocationDto: CreateLocationDto) {
    const newLocation = await this.prisma.viTri.create({
      data: { ...createLocationDto },
    });
    return newLocation;
  }

  async findAll() {
    const locations = await this.prisma.viTri.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return locations;
  }

  async findAllWithPagination(
    query: QueryLocationDto,
  ): Promise<PaginationResult<ViTri>> {
    const softDeleteFilter = { isDeleted: false };

    const data = await getItemsPagination<ViTri>(
      query,
      this.prisma.viTri,
      softDeleteFilter,
    );

    return data;
  }

  async findOne(id: number) {
    const locationExist = await this.findLocationExisting(id);
    return locationExist;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const locationExist = await this.findLocationExisting(id);
    const newLocationInfo = await this.prisma.viTri.update({
      data: { ...updateLocationDto },
      where: { id: locationExist.id },
    });
    return newLocationInfo;
  }

  async remove(id: number) {
    const locationExist = await this.findLocationExisting(id);
    await this.prisma.viTri.update({
      data: {
        isDeleted: false,
      },
      where: {
        id: locationExist.id,
      },
    });
    return true;
  }

  async uploadImageLocal(query: QueryIdDto, file: Express.Multer.File) {
    const locationExist = await this.findLocationExisting(+query.id);
    if (!file) {
      throw new BadRequestException('Upload file not found!');
    }

    await this.prisma.viTri.update({
      where: {
        id: locationExist.id,
      },
      data: {
        hinh_anh: file.path,
      },
    });

    if (locationExist.hinh_anh) {
      // xóa hinh anh vi tri đã tồn tại
      const oldFilePath = locationExist.hinh_anh;
      const filExist = await fileExists(oldFilePath);
      if (filExist) {
        deleteFile(oldFilePath);
      }
    }

    return true;
  }
}
