import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Users } from 'generated/prisma';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { QueryUserDto } from './dto/query-user.dto';
import {
  deleteFile,
  fileExists,
  getItemsPagination,
  PaginationResult,
} from 'src/common/helpers/utils';
import { use } from 'passport';

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
    const users = await this.prisma.users.findMany({
      where: {
        isDeleted: false,
      },
    });
    return users;
  }

  async checkUserExist(id: number) {
    const userExist: Users | null = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!userExist || userExist.isDeleted === true)
      throw new BadRequestException('User does not exist!!!');

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
    await this.prisma.users.update({
      data: {
        isDeleted: true,
      },
      where: { id: userExist.id },
    });
    return `This action removes a #${id} user`;
  }

  async findAllUserPagination(
    query: QueryUserDto,
  ): Promise<PaginationResult<Users>> {
    const softDeleteFilter = { isDeleted: false };

    const data = await getItemsPagination<Users>(
      query,
      this.prisma.viTri,
      softDeleteFilter,
    );

    return data;
  }

  async findAllUserByName(teNguoiDung: string) {
    const users = await this.prisma.users.findMany({
      where: {
        ten: teNguoiDung,
        isDeleted: false,
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
        isDeleted: false,
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

  async registerHost(user: Users) {
    if (user.roleId === 1) return true;

    await this.prisma.users.update({
      data: {
        roleId: 3,
      },
      where: {
        id: user.id,
      },
    });

    return true;
  }

  async getInfo(user: Users) {
    const userInfo = await this.prisma.users.findUnique({
      where: {
        id: user.id,
      },
      omit: {
        password: true,
      },
    });

    return userInfo;
  }
}
