import { Injectable } from '@nestjs/common';
import type { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async markRead(user: Users, ids: number[]) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: ids },
        receiverId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return { updated: result.count };
  }

  async findAll(user: Users, query: QueryPaginationDto) {
    let { page, pageSize, filtersStringJson } = query;
    page = +page > 0 ? +page : 1; // avoid return error, for user experience
    pageSize = +pageSize > 0 ? +pageSize : 10;
    const filters = JSON.parse(filtersStringJson || '{}') || {
      isRead: false,
      type: 'booking',
    };

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

    const bookingNotificationPromise = this.prisma.notification.findMany({
      skip: index,
      take: +pageSize,

      where: {
        ...filters,
      },
    });

    // counts total rows in table
    const totalBookingNotificationPromise = this.prisma.notification.count();

    const [bookingNotifications, totalUsers] = await Promise.all([
      bookingNotificationPromise,
      totalBookingNotificationPromise,
    ]);

    // calculate total pages
    const totalPages = Math.ceil(totalUsers / +pageSize);
    return {
      page,
      pageSize,
      totalItem: totalUsers,
      totalPage: totalPages,
      items: bookingNotifications || [],
    };
  }

  async findAllUserByName(teNguoiDung: string) {
    const users = await this.prisma.users.findMany({
      where: {
        ten: teNguoiDung,
        isDeleted: false,
      },
    });

    return `This action returns all notification`;
  }

  async countNotifications(user: Users) {
    const count = await this.prisma.notification.count({
      where: {
        receiverId: user.id,
        isRead: false,
      },
    });

    return count;
  }

  async remove(id: number) {
    await this.prisma.notification.delete({
      where: {
        id: id,
      },
    });
    return true;
  }
}
