import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { BinhLuan, Users } from 'generated/prisma';
import { use } from 'passport';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, user: Users) {
    // prevent more than one comment from one user
    const isCommented: BinhLuan | null = await this.prisma.binhLuan.findFirst({
      where: {
        ma_nguoi_binh_luan: user.id,
        ma_phong: createCommentDto.ma_phong,
      },
    });

    if (isCommented)
      throw new BadRequestException('Comment already existed!!!');
    const newComment = this.prisma.binhLuan.create({
      data: {
        ...createCommentDto,
        ma_nguoi_binh_luan: user.id,
      },
    });
    return newComment;
  }

  async findAll() {
    const comments = await this.prisma.binhLuan.findMany({
      orderBy: {
        sao_binh_luan: 'desc',
      },
    });

    return comments;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: Users) {
    const isExistedComment: BinhLuan | null =
      await this.prisma.binhLuan.findUnique({
        where: {
          id: id,
        },
      });

    if (!isExistedComment)
      throw new BadRequestException('Not existed comment!!!');

    if (isExistedComment.ma_phong !== updateCommentDto.ma_phong)
      throw new BadRequestException('Mismatch room Id!!!');

    if (isExistedComment.ma_nguoi_binh_luan !== user.id)
      throw new BadRequestException("Can not edit other user's comment!!!");

    const newComment: BinhLuan = await this.prisma.binhLuan.update({
      data: {
        ...updateCommentDto,
      },
      where: {
        id: id,
      },
    });
    return newComment;
  }

  async remove(id: number, user: Users) {
    const isExistedComment: BinhLuan | null =
      await this.prisma.binhLuan.findUnique({
        where: {
          id: id,
        },
      });

    if (!isExistedComment)
      throw new BadRequestException('Not existed comment!!!');

    if (isExistedComment.ma_nguoi_binh_luan !== user.id)
      throw new BadRequestException("Can not delete other user's comment!!!");

    await this.prisma.binhLuan.delete({
      where: {
        id: id,
      },
    });
    return true;
  }

  async findCommentByRoomId(maPhong: number) {
    if (maPhong <= 0) return [];

    const comments = await this.prisma.binhLuan.findMany({
      where: {
        ma_phong: maPhong,
      },
      orderBy: {
        sao_binh_luan: 'desc',
      },
    });

    return comments;
  }
}
