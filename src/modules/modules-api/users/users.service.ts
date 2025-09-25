import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Users } from 'generated/prisma';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { QueryUserDto } from './dto/query-user.dto';
import { deleteFile, fileExists } from 'src/common/helpers/utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: SignupDto) {
    return this.authService.signup(createUserDto);
  }

  async findAll() {
    const users = await this.prisma.users.findMany();
    return users;
  }

  async checkUserExist(id: number) {
    const userExist: Users | null = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!userExist) throw new BadRequestException('User does not exist!!!');

    return userExist;
  }

  async findOne(id: number) {
    const userExist: Users | null = await this.checkUserExist(id);

    return userExist;
  }

  async updateProfile(updateUserDto: UpdateUserProfileDto, user: Users) {
    const { name, phone, birthday, gender } = updateUserDto;
    const newUserInfo = await this.prisma.users.update({
      data: {
        ten: name,
        so_dien_thoai: phone,
        ngay_sinh: birthday,
        gioi_tinh: gender,
      },
      where: {
        id: user.id,
      },
    });
    return newUserInfo;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExist: Users = await this.checkUserExist(id);
    const hashedPassword = updateUserDto.password
      ? bcrypt.hashSync(updateUserDto.password, 10)
      : undefined;
    const newUserInfo = await this.prisma.users.update({
      data: {
        ten: updateUserDto.name,
        password: hashedPassword,
        email: updateUserDto.email,
        so_dien_thoai: updateUserDto.phone,
        ngay_sinh: updateUserDto.birthday,
        gioi_tinh: updateUserDto.gender,
      },
      where: {
        id: userExist.id,
      },
    });
    return newUserInfo;
  }

  async remove(id: number) {
    const userExist: Users | null = await this.checkUserExist(id);
    await this.prisma.users.delete({ where: { id: userExist.id } });
    return `This action removes a #${id} user`;
  }

  async findAllUserPagination(query: QueryUserDto) {
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

    const userPromise = this.prisma.users.findMany({
      skip: index,
      take: +pageSize,

      where: {
        ...filters,
      },
    });

    // counts total rows in table
    const totalUsersPromise = this.prisma.users.count();

    const [rooms, totalUsers] = await Promise.all([
      userPromise,
      totalUsersPromise,
    ]);

    // calculate total pages
    const totalPages = Math.ceil(totalUsers / +pageSize);
    return {
      page,
      pageSize,
      totalItem: totalUsers,
      totalPage: totalPages,
      items: rooms || [],
    };
  }

  async findAllUserByName(teNguoiDung: string) {
    const users = await this.prisma.users.findMany({
      where: {
        ten: teNguoiDung,
      },
    });

    return users;
  }

  async upLoadAvatar(file: Express.Multer.File, user) {
    if (!file) {
      throw new BadRequestException('Upload file not found!');
    }

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: file.path,
      },
    });

    if (user.avatar) {
      // xóa avatar đã tồn tại
      const oldFilePath = user.avatar;
      const filExist = await fileExists(oldFilePath);
      if (filExist) {
        deleteFile(oldFilePath);
      }
    }

    return true;
  }
}
