import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import type { Users } from 'generated/prisma';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('binh-luan')
@ExcludeFields('deletedBy', 'isDeleted', 'deletedAt')
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @MessageResponse('Get all comments successfully')
  findAll() {
    return this.commentService.findAll();
  }

  @Post()
  @MessageResponse('Create a comment successfully')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: Users,
  ) {
    return this.commentService.create(createCommentDto, user);
  }

  @Patch(':id')
  @MessageResponse('Edit a comment successfully')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: Users,
  ) {
    return this.commentService.update(+id, updateCommentDto, user);
  }

  @Delete(':id')
  @MessageResponse('Delete a comment successfully')
  remove(@Param('id') id: string, @CurrentUser() user: Users) {
    return this.commentService.remove(+id, user);
  }

  @Get('lay-binh-luan-theo-phong/:MaPhong')
  @MessageResponse('Get comments successfully')
  findCommentByRoomId(@Param('MaPhong') maPhong: string) {
    return this.commentService.findCommentByRoomId(+maPhong);
  }
}
