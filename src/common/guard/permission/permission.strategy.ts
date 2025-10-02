import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PermissionStrategy extends PassportStrategy(
  Strategy,
  'permission',
) {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async validate(req: Request & { user: Users }) {
    console.log('Guard --- permission - validate');
    const user = req.user;
    const method = req.method;
    const endpoint = req.baseUrl + req.route?.path;
    if (!user) {
      throw new BadRequestException('User not found!!!');
    }

    // role admin will be passed through all
    if (user.roleId === 1) {
      return user;
    }

    const rolePermissionExist = await this.prisma.phanQuyen.findFirst({
      where: {
        ma_vai_tro: user.roleId,
        Quyen: {
          endpoint: endpoint,
          method: method,
        },
        isActive: true,
      },
    });

    if (!rolePermissionExist) {
      throw new BadRequestException('Not permission!!!');
    }

    return user;
  }
}
